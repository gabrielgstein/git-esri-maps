import Geostats from 'geostats';
import chroma from 'chroma-js';
import hash from 'object-hash';
import SCOPE from '../scope';
import Actions from '../actions';
import GeoService from '../services/GeoService';
import ChartHelper from '../helpers/ChartHelper';
import FeatureHelper from "../helpers/FeatureHelper";
import qs from 'qs';

const ESRI = () => {
    return SCOPE.ESRI;
};

export default class ESRIMap {

    layers = {};
    activeLayers = {};
    graphicAttributes = {};
    responses = {};

    queue = (cb, timeout = 0) => {
        setTimeout(cb, timeout);
    };

    constructor(mapTarget, options, dispatch, canvas, authentication) {
        if (SCOPE.API) {
            return;
        }

        if (authentication && authentication.arcgis) {
            const {appId, portalUrl} = authentication.arcgis;
            const info = new ESRI().OAuthInfo({appId, portalUrl});
            const esriId = ESRI().IdentityManager;

            esriId.registerOAuthInfos([info]);

            let def = esriId.getCredential(info.portalUrl + '/sharing');

            def.then((auth) => {

                const hashObject = {
                    '#access_token': auth.token,
                    expires_in: auth.expires,
                    username: auth.userId,
                    ssl: auth.ssl,
                    portalUrl: auth.server
                };

                const _hash = qs.stringify(hashObject);

                window.localStorage.setItem('brintell-esri-map-token', auth.token);

                esriId.setOAuthResponseHash(_hash);
            }).otherwise((error) => {
                console.log(error);
            });
        }


        this.canvas = canvas;
        this.dispatch = dispatch;
        this.map = new ESRI().Map(mapTarget, options);
        this.map.on('click', (event) => {
            const {graphic} = event;
            if (graphic) {
                const {_layer, attributes, symbol} = graphic;
                const layerInstance = _layer.layerInstance;
                this.dispatch(Actions.mapActions.featureClick(attributes, graphic.fields, layerInstance.layerId, symbol._symbolInfo));
            } else {
                this.dispatch(Actions.mapActions.mapClick());
            }
        });
        this.map.on('extent-change', (event) => {
            this.queue(() => {
                this.dispatch(Actions.mapActions.mapExtentChange());
            });
        });
        this.map.on('zoom-end', (event) => {
            this.queue(() => {
                this.dispatch(Actions.mapActions.mapZoomChange());
            });
        });
        this.map.on('pan-start', (event) => {
            this.queue(() => {
                this.dispatch(Actions.mapActions.panStarted());
            });
        });
        this.map.on('resize', (event) => {
            this.queue(() => {
                this.dispatch(Actions.mapActions.mapResized());
            });
        });

        this.snapManager = this.map.enableSnapping();
        this.drawingTool = new ESRI().Draw(this.map);
        this.drawingTool.on('draw-complete', this.onDrawingComplete);

        try {
            const measurementTarget = document.querySelector('.measurement-widget #measurement-widget');
            this.measurement = new ESRI().Measurement({
                map: this.map
            }, measurementTarget);
            this.measurement.hide();
            this.measurement.startup();
        } catch (err) {
            console.warn(err);
        }

        SCOPE.API = this;
    }

    highlightHelpers = {};

    getGraphicHash = (graphic) => {
        const {attributes, _layer} = graphic;

        const graphicIdentity = {
            attributes,
            layerId: _layer.layerInstance.layerId,
            workspaceId: _layer.layerInstance.workspaceId
        };

        return hash(graphicIdentity);
    };

    highlight = (graphicId) => {
        this.highlightHelpers[graphicId].highlight();
    };

    clearHighlight = (graphicId) => {
        this.highlightHelpers[graphicId].clearHighlight();
    };

    generateHighlightHelper = (graphic) => {
        const {_layer, attributes} = graphic;
        const graphicHash = this.getGraphicHash(graphic);

        let highlightHelper = this.highlightHelpers[graphicHash];

        if (!highlightHelper) {
            let highlight, clearHighlight, rendererSymbol;
            const layerRenderer = _layer.renderer;

            if (!graphic.symbol && layerRenderer) {
                if (layerRenderer._symbols) {
                    const attributeField = layerRenderer.attributeField;
                    const attribute = attributes[attributeField];
                    if (layerRenderer.breaks) {
                        for (let symbolBreak of layerRenderer.breaks) {
                            if (attribute >= symbolBreak[0] && attribute <= symbolBreak[1]) {
                                rendererSymbol = layerRenderer._symbols[symbolBreak[0] + '-' + symbolBreak[1]];
                                break;
                            }
                        }
                    } else {
                        const symbol = layerRenderer._symbols[attribute];
                        rendererSymbol = symbol.symbol;
                    }

                    graphic.setSymbol(ESRI().jsonUtils.fromJson(rendererSymbol.toJson()));

                } else if (layerRenderer.symbol) {
                    graphic.setSymbol(ESRI().jsonUtils.fromJson(layerRenderer.symbol.toJson()));
                }
            }

            const symbol = graphic.symbol || {};

            const type = symbol.__proto__.declaredClass || layerRenderer.__proto__.declaredClass ||  '';

            switch (type) {
                case 'esri.renderer.UniqueValueRenderer':
                case 'esri.symbol.PictureMarkerSymbol':
                    const width = symbol.width;
                    const height = symbol.height;

                    highlight = () => {
                        graphic.symbol.setWidth(width * 1.25);
                        graphic.symbol.setHeight(height * 1.25);
                        graphic.draw();
                    };

                    clearHighlight = () => {
                        graphic.symbol.setWidth(width);
                        graphic.symbol.setHeight(height);
                        graphic.draw();
                    };
                    break;
                default:
                case 'esri.symbol.SimpleFillSymbol':
                    const originalSymbol = symbol.toJson();
                    highlight = () => {
                        graphic.symbol.setOutline(new ESRI().SimpleLineSymbol(
                            ESRI().SimpleLineSymbol.STYLE_SOLID,
                            new ESRI().Color([255,0,0]), 3
                        ));
                        graphic.draw();
                    };

                    clearHighlight = () => {
                        graphic.symbol.setOutline(ESRI().jsonUtils.fromJson(originalSymbol).outline);
                        graphic.draw();
                    };
                    break;
            }
            highlightHelper =  {
                highlight,
                clearHighlight
            };

            this.highlightHelpers[graphicHash] = highlightHelper;
        }
    };

    getGraphicAttributes = (graphicId) => {
        return this.graphicAttributes[graphicId];
    };

    drawFilter() {
        this.drawingTool.activate(ESRI().Draw['FREEHAND_POLYGON'])
    }

    deactivateDrawFilter() {
        this.drawingTool.deactivate();
    }

    onDrawingComplete = ({geometry}) => {

        const selectedFeatures = {};

        for (let id in this.activeLayers) {
            if (this.activeLayers[id]) {
                const graphics = this.layers[id].graphics || [];
                graphics.forEach((graphic) => {
                    selectedFeatures[id] = selectedFeatures[id] || [];
                    const comparisonGeometry = graphic.geometry;
                    const contains = ESRI().geometryEngine.contains(geometry, comparisonGeometry);

                    if (!contains) {
                        const intersects = ESRI().geometryEngine.intersects(geometry, comparisonGeometry);
                        if (!intersects) {
                            return;
                        }
                    }

                    const feature = {
                        feature: graphic,
                        highlightHelper: this.generateHighlightHelper(graphic),
                        layerInstance: this.layers[id].layerInstance
                    };

                    selectedFeatures[id].push(feature);
                });
            }
        }

        this.dispatch(Actions.mapActions.setAreaFilter(selectedFeatures));
        this.drawingTool.deactivate();
    };

    changeZoom(newZoom) {
        this.map.setZoom(newZoom);
    }

    changeBasemap(basemap) {
        this.map.setBasemap(basemap);
    }

    removeLayer(layerId) {
        const layer = this.layers[layerId];
        if (layer && this.map) {
            this.map.removeLayer(layer);
            delete this.layers[layerId];
            delete this.activeLayers[layerId];
        }
    }

    getZoom() {
        return this.map.getZoom();
    }

    centerAtLayer(layerInstanceId) {
        const layer = this.layers[layerInstanceId];
        if (layer) {
            const extent = layer.fullExtent;
            if (extent) {
                this.map.setExtent(extent, true).then(() => {
                    setTimeout(() => {
                        this.dispatch(Actions.mapActions.zoomChange(null, this.map.getZoom()));
                    }, 0);
                });
            }
        }
    }

    buildLayer(layerInstance, enrichedSource) {

        let promise;

        switch (layerInstance.type) {
            case 'Feature Layer':
                promise = this.buildFeatureLayer(layerInstance, enrichedSource);
                break;
            default:
                promise = this.buildCustomLayer(layerInstance, enrichedSource);
                break;
        }

        promise.then((layer) => {
            layer.setOpacity(layerInstance.opacity / 100);
            this.map.addLayer(layer);
            layer.on('mouse-over', (mouseOverEvent) => {

                let pageX = mouseOverEvent.pageX;
                let pageY = mouseOverEvent.pageY;

                const onMouseMoveListener = layer.on('mouse-move', (mouseMoveEvent) => {
                    pageX = mouseMoveEvent.pageX;
                    pageY = mouseMoveEvent.pageY;
                });

                const mouseOverTimeout = setTimeout(() => {
                    const {graphic} = mouseOverEvent;
                    if (graphic) {
                        const {_layer, attributes} = graphic;
                        const layerInstance = _layer.layerInstance;
                        const graphicId = this.getGraphicHash(graphic);
                        this.generateHighlightHelper(graphic);
                        this.graphicAttributes[graphicId] = attributes;
                        this.dispatch(Actions.mapActions.featureHover(graphicId, layerInstance.layerId, attributes, {x: pageX, y: pageY}));
                    }
                }, 600);
                const onMouseOutListener = layer.on('mouse-out', () => {
                    setTimeout(() => {
                        this.dispatch(Actions.mapActions.mouseOutOfFeature());
                    }, 50);
                    onMouseOutListener.remove();
                    onMouseMoveListener.remove();
                    clearTimeout(mouseOverTimeout);
                });
            });
            this.activeLayers[layerInstance.layerId] = true;
            this.layers[layerInstance.layerId] = layer;
            this.layers[layerInstance.layerId].layerInstance = layerInstance;
            if (layer.fullExtent && layer.fullExtent.xmax !== undefined) {
                // this.centerAtLayer(layerInstance.layerId);
            } else {
                const updateListener = layer.on('update', () => {
                    // this.centerAtLayer(layerInstance.layerId);
                    updateListener.remove();
                });
            }
        });

        promise.catch((error) => {
            this.dispatch(Actions.layersActions.layerBuilt(layerInstance.layerId, error));
        });

    }

    buildFeatureLayer(layerInstance, enrichedSource) {
        return new Promise((resolve, reject) => {
            try {

                const featureLayer = new ESRI().FeatureLayer(enrichedSource.url, {
                    mode: ESRI().FeatureLayer.MODE_SNAPSHOT,
                    outFields: enrichedSource.params && enrichedSource.params.outFields && enrichedSource.params.outFields.split(',')
                });

                const loadListener = featureLayer.on('load', () => {
                    try {
                        loadListener.remove();
                        this.dispatch(Actions.layersActions.layerBuilt(layerInstance.layerId));
                        const { renderer } = featureLayer;
                        if (renderer) {
                            const values = [];
                            if (renderer.symbol) {
                                const color = renderer.symbol.color;
                                values.push(
                                    {
                                        value: 'Unique Symbol',
                                        color: color ? color.toRgba() : undefined
                                    }
                                );
                                this.dispatch(Actions.layersActions.legendCreated('values', layerInstance.layerId, values));
                            } else if (renderer.infos) {
                                renderer.infos.map((info) => {
                                    try {
                                        const {color, url} = info.symbol;

                                        values.push({
                                            value: info.label || info.value,
                                            color: color && color.toRgba ? color.toRgba() : undefined,
                                            url: url
                                        });
                                    } catch (e) {
                                        console.warn(e);
                                    }

                                });
                                this.dispatch(Actions.layersActions.legendCreated('values', layerInstance.layerId, values));
                            }
                        }
                        resolve(featureLayer);
                    } catch (error) {
                        reject(error);
                    }
                });

            } catch (error) {
                reject(error);
            }
        });

    }

    reorderLayers(layersOrder) {
        const reverseOrder = layersOrder.slice().reverse();
        reverseOrder.forEach((layerId, index) => {
            const layer = this.layers[layerId];
            if (layer) {
                this.map.reorderLayer(layer, index);
            }
        });
    }

    toggleRuler(value) {
        if (value) {
            window.document.body.classList.add('calcite');
            this.measurement.show();
        } else {
            window.document.body.classList.remove('calcite');
            this.measurement.hide();
        }
    }

    buildCustomLayer(layerInstance, enrichedSource) {
        return new Promise((resolve, reject) => {
            try {
                const promise = GeoService.query(enrichedSource);
                promise.then((response) => {
                    setTimeout(() => {
                        this.dispatch(Actions.appActions.generateMetaData(({enrichedSourceResponse: response, enrichedSourceId: enrichedSource.id})));
                    }, 0);
                    try {
                        this.responses[hash({layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource})] = response;
                        const featureSet = new ESRI().FeatureSet(response);
                        const featureLayer = new ESRI().FeatureLayer({
                            layerDefinition: response,
                            featureSet: featureSet
                        });

                        const finishBuilding = () => {

                            if (featureLayer.graphics.length) {
                                const loadListener = featureLayer.on('update', () => {
                                    featureLayer.fullExtent = ESRI().graphicsUtils.graphicsExtent(featureLayer.graphics);
                                    this.dispatch(Actions.layersActions.layerBuilt(layerInstance.layerId));
                                    loadListener.remove();
                                });
                            } else {
                                this.dispatch(Actions.layersActions.layerBuilt(layerInstance.layerId));
                            }

                            resolve(featureLayer);
                        };

                        switch (layerInstance.type) {
                            case 'custom':
                            case 'Custom':
                                this.applyCustomTheming(featureLayer, layerInstance, response);
                                finishBuilding();
                                break;
                            case 'Stacked Bubble':
                                const promise = this.applyStackedBubbleSymbology(featureLayer, layerInstance);
                                promise.then(finishBuilding);
                                promise.catch(reject);
                                break;
                            default:
                                const renderer = this.buildRenderer(layerInstance, response);
                                featureLayer.setRenderer(renderer);
                                finishBuilding();
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
                promise.catch((error) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });

    }

    applyStackedBubbleSymbology = (featureLayer, layerInstance) => {
        return new Promise((resolve, reject) => {
            const {graphics} = featureLayer;
            const {size, metrics} = layerInstance.renderer;
            const promises = [];

            const values = metrics.map(metric => {
                return {
                    value: metric.label,
                    color: metric.color
                }
            });

            this.dispatch(Actions.layersActions.legendCreated('values', layerInstance.layerId, values));

            if (graphics && graphics.forEach) {
                graphics.forEach((feature, index) => {
                    const promise = ChartHelper.buildStackedBubbleBase64({canvas: this.canvas, metrics, attributes: feature.attributes});
                    promise.then((base64) => {
                        const symbol = new ESRI().PictureMarkerSymbol(base64, size, size);
                        feature.setSymbol(symbol);
                    });
                    promises.push(promise);
                });
            }

            Promise.all(promises).then(resolve).catch(reject)
        });
    };

    toggleLayer(id, value) {

        if (!this.layers[id]) return;

        if (value) {
            this.activeLayers[id] = true;
            this.layers[id].show();
        } else {
            this.activeLayers[id] = false;
            this.layers[id].hide();
        }
    };

    changeLayerOpacity(id, opacity) {
        if (!this.layers[id]) return;
        this.layers[id].setOpacity(opacity / 100);
    }

    buildRenderer = (layerInstance, response) => {

        const { renderer } = layerInstance;

        switch (layerInstance.type) {
            case 'breaks':
            case 'Breaks':
                return this.buildBreaksRenderer(layerInstance, renderer, response);
            case 'Unique':
            case 'Unique Values':
            case 'unique':
            case 'unique values':
                return this.buildUniqueValuesRenderer(layerInstance, renderer, response);
            case 'Simple':
            case 'simple':
                return this.buildSimpleRenderer(layerInstance, renderer, response);
        }

    };

    applyCustomTheming = (featureLayer, layerInstance, response) => {
        const {renderer} = layerInstance;
        const {size, color, shape} = renderer;
        const defaultSymbol = renderer.default;
        const {graphics} = featureLayer;
        const {geometryType} = response;
        const multipleLegend = {};
        const responseId = hash({layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource});

        const applySymbolInfo = (breaks, field) => {
            const firstElement = breaks[0] || {};
            const isUniqueValues = !!firstElement.value;
            if (isUniqueValues) {
                const uniqueValuesMap = {};

                breaks.forEach((breakInfo) => {
                    uniqueValuesMap[breakInfo.value] = breakInfo;
                });

                graphics.forEach((graphic) => {
                    const {attributes} = graphic;
                    const symbolInfo = uniqueValuesMap[attributes[field]];
                    if (symbolInfo) {
                        graphic.symbol = this.getProperSymbol(geometryType, Object.assign({}, defaultSymbol, symbolInfo), graphic.symbol);
                        Object.assign(symbolInfo, defaultSymbol);
                    }
                });

            } else {
                graphics.forEach((graphic) => {
                    const {attributes} = graphic;
                    const value = attributes[field];
                    let currentInfo;
                    for (let breakInfo of breaks) {
                        if (value >= breakInfo.minValue && value < breakInfo.maxValue) {
                            currentInfo = breakInfo;
                            break;
                        } else if (value > breakInfo.minValue && value <= breakInfo.maxValue) {
                            currentInfo = breakInfo;
                            break;
                        }
                    }
                    if (currentInfo) {
                        graphic.symbol = this.getProperSymbol(geometryType, Object.assign({}, defaultSymbol, currentInfo), graphic.symbol);
                        Object.assign(currentInfo, defaultSymbol);
                    }
                });
            }
        };

        if (shape) {
            const {dynamicBreaks, field, custom} = shape;
            const shapeBreaks = custom || this.getBreaks(dynamicBreaks, field, responseId);
            multipleLegend.shapes = shapeBreaks;

            applySymbolInfo(shapeBreaks, field);
        }


        if (color) {
            const {dynamicBreaks, field, custom} = color;
            const colorBreaks = custom || this.getBreaks(dynamicBreaks, field, responseId);
            multipleLegend.colors = colorBreaks;

            applySymbolInfo(colorBreaks, field);
        }

        if (size) {
            const {dynamicBreaks, field, custom} = size;
            const sizeBreaks = custom || this.getBreaks(dynamicBreaks, field, responseId);
            multipleLegend.size = sizeBreaks;

            applySymbolInfo(sizeBreaks, field);
        }

        this.dispatch(Actions.layersActions.legendCreated('multiple', layerInstance.layerId, multipleLegend));
    };

    buildBreaksRenderer = (layerInstance, renderer, response) => {

        const rendererClass = new ESRI().BreaksRenderer(null, renderer.field);
        const {shape, borderColor, borderWidth} = renderer;
        const breaks = renderer.breaks || this.getThematicBreaks(layerInstance, renderer);
        breaks.forEach((breakConfig) => {
            const { minValue, maxValue } = breakConfig;
            breakConfig.shape = shape;
            breakConfig.borderColor = borderColor;
            breakConfig.borderWidth = borderWidth;
            rendererClass.addBreak(minValue, maxValue, this.getProperSymbol(response.geometryType, breakConfig));
        });

        if (!renderer.breaks) {
            this.dispatch(Actions.layersActions.legendCreated('breaks', layerInstance.layerId, breaks));
        }

        return rendererClass;
    };

    getBreaks = (config, field, responseId) => {
        const response = this.responses[responseId];
        const { features } = response;
        let {
            classification,
            breakCount,
            colors,
            minSize,
            maxSize,
            precision,
            shapes
        } = config;
        const values = [], breaks = [];
        let isNumber = true;

        features.forEach((feature) => {
            try {
                let value = FeatureHelper.getAttribute(field, feature.attributes);
                let valueInNumber = Number(value);
                let invalidNumber = isNaN(valueInNumber);
                if (invalidNumber) isNumber = false;
                values.push(invalidNumber ? value : valueInNumber);
            } catch (e) {
                console.warn(e);
            }
        });

        const stats = new Geostats(values);
        let breakValues;
        let isUniqueValues;

        if ((!isNumber && classification !== 'Unique Values') || !values.length) {
            return [];
        }

        switch (classification) {
            case 'Unique Values':
                breakValues = stats.getClassUniqueValues();
                breakCount = breakValues.length;
                isUniqueValues = true;
                break;
            default:
            case 'Equal Intervals':
                breakValues = stats.getClassEqInterval(breakCount);
                break;
            case 'Standard Deviation':
                breakValues = stats.getClassStdDeviation(breakCount);
                break;
            case 'Arithmetic Progression':
                breakValues = stats.getClassArithmeticProgression(breakCount);
                break;
            case 'Geometric Progression':
                breakValues = stats.getClassGeometricProgression(breakCount);
                break;
            case 'Quantile':
                breakValues = stats.getClassQuantile(breakCount);
                break;
            case 'Jenks':
                breakValues = stats.getClassJenks(breakCount);
                break;
        }

        const setPrecision = (value) => {
            return precision !== undefined ? Number(value.toFixed(precision)) : value;
        };

        let iterateFunction;

        if (colors) {
            while (colors.length < 2) {
                colors.push(colors[0] || 'blue');
            }

            const colorRamp = chroma.scale(colors).colors(breakCount);

            iterateFunction = (breakValue, index) => {

                if (isUniqueValues) {
                    breaks.push({
                        value: breakValue,
                        color: colorRamp[index]
                    });
                } else {
                    if (index === breakValues.length - 1) return;

                    breaks.push({
                        minValue: setPrecision(breakValue),
                        maxValue: setPrecision(breakValues[index + 1]),
                        color: colorRamp[index]
                    });
                }
            }
        } else if (minSize !== undefined && maxSize !== undefined) {
            const sizeBreaks = [];
            sizeBreaks.push(minSize);

            const sizeInterval = (maxSize - minSize) / (breakCount - 1);

            for (let count = 1; count < breakCount - 1; count++) {
                sizeBreaks.push(minSize + (sizeInterval * count));
            }

            sizeBreaks.push(maxSize);

            iterateFunction = (breakValue, index) => {

                if (isUniqueValues) {
                    breaks.push({
                        value: breakValue,
                        size: sizeBreaks[index]
                    });
                } else {
                    if (index === breakValues.length - 1) return;

                    breaks.push({
                        minValue: setPrecision(breakValue),
                        maxValue: setPrecision(breakValues[index + 1]),
                        size: sizeBreaks[index]
                    });
                }
            }

        } else if (shapes) {

            if (!shapes.length) {
                shapes = ['square'];
            }

            let shapeIndex = 0;

            iterateFunction = (breakValue, index) => {

                if (isUniqueValues) {
                    breaks.push({
                        value: breakValue,
                        shape: shapes[shapeIndex]
                    });
                } else {
                    if (index === breakValues.length - 1) return;

                    breaks.push({
                        minValue: setPrecision(breakValue),
                        maxValue: setPrecision(breakValues[index + 1]),
                        shape: shapes[shapeIndex]
                    });
                }

                shapeIndex = shapeIndex >= shapes.length - 1 ? 0 : shapeIndex + 1;
            }
        }

        breakValues.forEach(iterateFunction);

        return breaks;
    };

    buildSimpleRenderer = (layerInstance, renderer, response) => {
        const symbolConfig = Object.assign({
            color: '#3f51b5',
            size: 14,
            borderColor: 'black',
            borderWidth: 2,
            shape: 'square'
        }, renderer);

        this.dispatch(Actions.layersActions.legendCreated('values', layerInstance.layerId, [{
            value: layerInstance.title,
            color: symbolConfig.color,
            borderColor: symbolConfig.borderColor,
            shape: symbolConfig.shape,
            borderWidth: symbolConfig.borderWidth
        }]));

        const properSymbol = this.getProperSymbol(response.geometryType, symbolConfig);
        return new ESRI().SimpleRenderer(properSymbol);
    };

    buildUniqueValuesRenderer = (layerInstance, renderer, response) => {
        const {uniqueValues, field, label, dynamicValues} = renderer;

        let properUniqueValues = {};
        if (dynamicValues) {
            const {features} = response;
            const {colors} = dynamicValues;
            const shapes = dynamicValues.shapes || ['circle'];
            const foundUniqueValues = {};

            features.forEach((feature) => {
                const {attributes} = feature;
                foundUniqueValues[attributes[field]] = true;
            });

            while (colors.length < 2) {
                colors.push(colors[0] || 'blue');
            }

            const colorRamp = chroma.scale(colors).colors(Object.keys(foundUniqueValues).length);

            let uniqueValueIndex = 0;
            let shapeIndex = 0;

            for (let uniqueValue in foundUniqueValues) {
                const shape = shapes && shapes[shapeIndex];
                properUniqueValues[uniqueValue] = {
                    value: label ? FeatureHelper.getSingleMetricRegex(label, {[field]: uniqueValue}) || uniqueValue : uniqueValue,
                    color: colorRamp[uniqueValueIndex],
                    shape: shape,
                    size: dynamicValues.size,
                    borderColor: dynamicValues.borderColor,
                    borderWidth: dynamicValues.borderWidth
                };
                uniqueValueIndex++;
                shapeIndex = shapeIndex >= shapes.length - 1 ? 0 : shapeIndex + 1;
            }
        } else {
            properUniqueValues = uniqueValues || [];
        }

        const defaultSymbol = this.getProperSymbol(response.geometryType, {color: 'transparent', borderWidth: 0, borderColor: 'transparent'});

        const uniqueRenderer = new ESRI().UniqueValueRenderer(defaultSymbol, field);
        const legendValues = [];

        for (let value in properUniqueValues) {
            const config = properUniqueValues[value];
            legendValues.push({
                value: label ? FeatureHelper.getSingleMetricRegex(label, {[field]: value}) || value : value,
                color: config.color,
                shape: config.shape,
                borderColor: config.borderColor,
                borderWidth: config.borderWidth
            });
            uniqueRenderer.addValue(value, this.getProperSymbol(response.geometryType, config));
        }

        this.dispatch(Actions.layersActions.legendCreated('values', layerInstance.layerId, legendValues));

        return uniqueRenderer;
    };

    getProperSymbol = (geometryType, breakConfig, symbol) => {

        let properSymbol;

        switch (geometryType) {
            case 'esriGeometryPolygon':
                properSymbol = this.getSimpleFillSymbol(breakConfig, symbol);
                break;
            case 'esriGeometryPoint':
                properSymbol = this.getSimpleMarkerSymbol(breakConfig, symbol);
                break;
        }

        properSymbol._symbolInfo = properSymbol._symbolInfo || [];
        properSymbol._symbolInfo.push(breakConfig);
        return properSymbol;

    };

    getSimpleFillSymbol = ({color, borderColor, borderWidth}, existingSymbol) => {
        const symbol = existingSymbol || new ESRI().SimpleFillSymbol();
        if (!existingSymbol) {
            symbol.setStyle(ESRI().SimpleFillSymbol.STYLE_SOLID);
        }
        if (borderColor || borderWidth) {
            symbol.setOutline(new ESRI().SimpleLineSymbol(ESRI().SimpleLineSymbol.STYLE_SOLID, new ESRI().Color(borderColor || 'black'), borderWidth === undefined ? 1 : borderWidth));
            symbol.outline.width = borderWidth;
        }

        if (color) {
            symbol.setColor(new ESRI().Color(color));
        }

        return symbol;
    };

    getSimpleMarkerSymbol = ({color, size, shape, borderColor, borderWidth}, existingSymbol) => {
        const symbol = existingSymbol || new ESRI().SimpleMarkerSymbol();
        let style;

        if (shape) {
            switch (shape) {
                case 'school':
                    symbol.setPath('<path d="M961,1000C980,1000,995,985,995,967V418C995,399,980,384,961,384H755V363C755,350,748,339,737,333L535,231V167L677,120C691,115,700,103,700,88C700,74,691,61,677,57L513,2C502-2,491,0,483,6C474,13,469,23,469,33V231L267,333C256,339,249,350,249,363V384H39C20,384,5,399,5,418V967C5,985,20,1000,39,1000H961zM535,106V71L608,88L535,106zM72,451H249V933H72V451zM316,383L502,289L688,383V933H316V383zM928,933H755V451H928V933zM450,439H396C377,439,362,454,362,473C362,491,377,506,396,506H450C469,506,484,491,484,473C484,454,469,439,450,439zM138,561H193C212,561,227,546,227,527C227,509,212,494,193,494H138C120,494,105,509,105,527C105,546,120,561,138,561zM193,604H138C120,604,105,619,105,637C105,656,120,671,138,671H193C212,671,227,656,227,637C227,619,212,604,193,604zM193,714H138C120,714,105,729,105,747C105,765,120,780,138,780H193C212,780,227,765,227,747C227,729,212,714,193,714zM817,561H872C891,561,906,546,906,527C906,509,891,494,872,494H817C799,494,784,509,784,527C784,546,799,561,817,561zM817,671H872C891,671,906,656,906,637C906,619,891,604,872,604H817C799,604,784,619,784,637C784,656,799,671,817,671zM872,714H817C799,714,784,729,784,747C784,765,799,780,817,780H872C891,780,906,765,906,747C906,729,891,714,872,714zM615,439H560C542,439,527,454,527,473C527,491,542,506,560,506H615C634,506,648,491,648,473C648,454,634,439,615,439zM450,549H396C377,549,362,564,362,582C362,601,377,616,396,616H450C469,616,484,601,484,582C484,564,469,549,450,549zM615,549H560C542,549,527,564,527,582C527,601,542,616,560,616H615C634,616,648,601,648,582C648,564,634,549,615,549zM450,659H396C377,659,362,674,362,692C362,711,377,725,396,725H450C469,725,484,711,484,692C484,674,469,659,450,659zM615,659H560C542,659,527,674,527,692C527,711,542,725,560,725H615C634,725,648,711,648,692C648,674,634,659,615,659z"/>');
                    style = 'path';
                    break;
                case 'star':
                    symbol.setPath('<path d=" M 320.000 340.000 L 340.000 354.641 L 337.321 330.000 L 360.000 320.000 L 337.321 310.000 L 340.000 285.359 L 320.000 300.000 L 300.000 285.359 L 302.679 310.000 L 280.000 320.000 L 302.679 330.000 L 300.000 354.641 z"/>');
                    style = 'path';
                    break;
                case 'cross':
                    style = ESRI().SimpleMarkerSymbol.STYLE_CROSS;
                    break;
                case 'diamond':
                    style = ESRI().SimpleMarkerSymbol.STYLE_DIAMOND;
                    break;
                case 'square':
                    style = ESRI().SimpleMarkerSymbol.STYLE_SQUARE;
                    break;
                case 'x':
                    style = ESRI().SimpleMarkerSymbol.STYLE_X;
                    break;
                case 'circle':
                case 'round':
                default:
                    style = ESRI().SimpleMarkerSymbol.STYLE_CIRCLE;
            }

            symbol.setStyle(style);
        }

        if (size) {
            symbol.setSize(size);
        }

        if (borderWidth || borderColor) {
            symbol.setOutline(new ESRI().SimpleLineSymbol(ESRI().SimpleLineSymbol.STYLE_SOLID, new ESRI().Color(borderColor || 'black'), borderWidth === undefined ? 1 : borderWidth));
            symbol.outline.width = borderWidth;
        }

        if (color) {
            symbol.setColor(new ESRI().Color(color));
        }

        return symbol;
    };

    getThematicBreaks = (layerInstance, renderer) => {

        const { dynamicBreaks, field } = renderer;
        const { classification, breakCount, colors, minSize, maxSize, precision } = dynamicBreaks;
        const responseId = hash({layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource});

        const colorBreaks = this.getBreaks({
            classification,
            breakCount,
            colors,
            precision
        }, field, responseId);

        if (minSize !== undefined && maxSize !== undefined) {
            const sizeBreaks = this.getBreaks({
                classification,
                breakCount,
                minSize,
                maxSize,
                precision
            }, field, responseId);

            colorBreaks.forEach((breakConfig, index) => {
                breakConfig.size = sizeBreaks[index].size;
            });
        }


        return colorBreaks;

    };

}
