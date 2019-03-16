'use strict';

exports.__esModule = true;
exports.default = undefined;

var _geostats = require('geostats');

var _geostats2 = _interopRequireDefault(_geostats);

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _scope = require('../scope');

var _scope2 = _interopRequireDefault(_scope);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _GeoService = require('../services/GeoService');

var _GeoService2 = _interopRequireDefault(_GeoService);

var _ChartHelper = require('../helpers/ChartHelper');

var _ChartHelper2 = _interopRequireDefault(_ChartHelper);

var _FeatureHelper = require('../helpers/FeatureHelper');

var _FeatureHelper2 = _interopRequireDefault(_FeatureHelper);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ESRI = function ESRI() {
    return _scope2.default.ESRI;
};

var ESRIMap = function () {
    function ESRIMap(mapTarget, options, dispatch, canvas, authentication) {
        var _this = this;

        _classCallCheck(this, ESRIMap);

        this.layers = {};
        this.activeLayers = {};
        this.graphicAttributes = {};
        this.responses = {};

        this.queue = function (cb) {
            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            setTimeout(cb, timeout);
        };

        this.highlightHelpers = {};

        this.getGraphicHash = function (graphic) {
            var attributes = graphic.attributes,
                _layer = graphic._layer;


            var graphicIdentity = {
                attributes: attributes,
                layerId: _layer.layerInstance.layerId,
                workspaceId: _layer.layerInstance.workspaceId
            };

            return (0, _objectHash2.default)(graphicIdentity);
        };

        this.highlight = function (graphicId) {
            _this.highlightHelpers[graphicId].highlight();
        };

        this.clearHighlight = function (graphicId) {
            _this.highlightHelpers[graphicId].clearHighlight();
        };

        this.generateHighlightHelper = function (graphic) {
            var _layer = graphic._layer,
                attributes = graphic.attributes;

            var graphicHash = _this.getGraphicHash(graphic);

            var highlightHelper = _this.highlightHelpers[graphicHash];

            if (!highlightHelper) {
                var highlight = void 0,
                    clearHighlight = void 0,
                    rendererSymbol = void 0;
                var layerRenderer = _layer.renderer;

                if (!graphic.symbol && layerRenderer) {
                    if (layerRenderer._symbols) {
                        var attributeField = layerRenderer.attributeField;
                        var attribute = attributes[attributeField];
                        if (layerRenderer.breaks) {
                            for (var _iterator = layerRenderer.breaks, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                                var _ref;

                                if (_isArray) {
                                    if (_i >= _iterator.length) break;
                                    _ref = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) break;
                                    _ref = _i.value;
                                }

                                var symbolBreak = _ref;

                                if (attribute >= symbolBreak[0] && attribute <= symbolBreak[1]) {
                                    rendererSymbol = layerRenderer._symbols[symbolBreak[0] + '-' + symbolBreak[1]];
                                    break;
                                }
                            }
                        } else {
                            var _symbol = layerRenderer._symbols[attribute];
                            rendererSymbol = _symbol.symbol;
                        }

                        graphic.setSymbol(ESRI().jsonUtils.fromJson(rendererSymbol.toJson()));
                    } else if (layerRenderer.symbol) {
                        graphic.setSymbol(ESRI().jsonUtils.fromJson(layerRenderer.symbol.toJson()));
                    }
                }

                var symbol = graphic.symbol || {};

                var type = symbol.__proto__.declaredClass || layerRenderer.__proto__.declaredClass || '';

                switch (type) {
                    case 'esri.renderer.UniqueValueRenderer':
                    case 'esri.symbol.PictureMarkerSymbol':
                        var width = symbol.width;
                        var height = symbol.height;

                        highlight = function highlight() {
                            graphic.symbol.setWidth(width * 1.25);
                            graphic.symbol.setHeight(height * 1.25);
                            graphic.draw();
                        };

                        clearHighlight = function clearHighlight() {
                            graphic.symbol.setWidth(width);
                            graphic.symbol.setHeight(height);
                            graphic.draw();
                        };
                        break;
                    default:
                    case 'esri.symbol.SimpleFillSymbol':
                        var originalSymbol = symbol.toJson();
                        highlight = function highlight() {
                            graphic.symbol.setOutline(new ESRI().SimpleLineSymbol(ESRI().SimpleLineSymbol.STYLE_SOLID, new ESRI().Color([255, 0, 0]), 3));
                            graphic.draw();
                        };

                        clearHighlight = function clearHighlight() {
                            graphic.symbol.setOutline(ESRI().jsonUtils.fromJson(originalSymbol).outline);
                            graphic.draw();
                        };
                        break;
                }
                highlightHelper = {
                    highlight: highlight,
                    clearHighlight: clearHighlight
                };

                _this.highlightHelpers[graphicHash] = highlightHelper;
            }
        };

        this.getGraphicAttributes = function (graphicId) {
            return _this.graphicAttributes[graphicId];
        };

        this.onDrawingComplete = function (_ref2) {
            var geometry = _ref2.geometry;


            var selectedFeatures = {};

            var _loop = function _loop(id) {
                if (_this.activeLayers[id]) {
                    var graphics = _this.layers[id].graphics || [];
                    graphics.forEach(function (graphic) {
                        selectedFeatures[id] = selectedFeatures[id] || [];
                        var comparisonGeometry = graphic.geometry;
                        var contains = ESRI().geometryEngine.contains(geometry, comparisonGeometry);

                        if (!contains) {
                            var intersects = ESRI().geometryEngine.intersects(geometry, comparisonGeometry);
                            if (!intersects) {
                                return;
                            }
                        }

                        var feature = {
                            feature: graphic,
                            highlightHelper: _this.generateHighlightHelper(graphic),
                            layerInstance: _this.layers[id].layerInstance
                        };

                        selectedFeatures[id].push(feature);
                    });
                }
            };

            for (var id in _this.activeLayers) {
                _loop(id);
            }

            _this.dispatch(_actions2.default.mapActions.setAreaFilter(selectedFeatures));
            _this.drawingTool.deactivate();
        };

        this.applyStackedBubbleSymbology = function (featureLayer, layerInstance) {
            return new Promise(function (resolve, reject) {
                var graphics = featureLayer.graphics;
                var _layerInstance$render = layerInstance.renderer,
                    size = _layerInstance$render.size,
                    metrics = _layerInstance$render.metrics;

                var promises = [];

                var values = metrics.map(function (metric) {
                    return {
                        value: metric.label,
                        color: metric.color
                    };
                });

                _this.dispatch(_actions2.default.layersActions.legendCreated('values', layerInstance.layerId, values));

                if (graphics && graphics.forEach) {
                    graphics.forEach(function (feature, index) {
                        var promise = _ChartHelper2.default.buildStackedBubbleBase64({ canvas: _this.canvas, metrics: metrics, attributes: feature.attributes });
                        promise.then(function (base64) {
                            var symbol = new ESRI().PictureMarkerSymbol(base64, size, size);
                            feature.setSymbol(symbol);
                        });
                        promises.push(promise);
                    });
                }

                Promise.all(promises).then(resolve).catch(reject);
            });
        };

        this.buildRenderer = function (layerInstance, response) {
            var renderer = layerInstance.renderer;


            switch (layerInstance.type) {
                case 'breaks':
                case 'Breaks':
                    return _this.buildBreaksRenderer(layerInstance, renderer, response);
                case 'Unique':
                case 'Unique Values':
                case 'unique':
                case 'unique values':
                    return _this.buildUniqueValuesRenderer(layerInstance, renderer, response);
                case 'Simple':
                case 'simple':
                    return _this.buildSimpleRenderer(layerInstance, renderer, response);
            }
        };

        this.applyCustomTheming = function (featureLayer, layerInstance, response) {
            var renderer = layerInstance.renderer;
            var size = renderer.size,
                color = renderer.color,
                shape = renderer.shape;

            var defaultSymbol = renderer.default;
            var graphics = featureLayer.graphics;
            var geometryType = response.geometryType;

            var multipleLegend = {};
            var responseId = (0, _objectHash2.default)({ layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource });

            var applySymbolInfo = function applySymbolInfo(breaks, field) {
                var firstElement = breaks[0] || {};
                var isUniqueValues = !!firstElement.value;
                if (isUniqueValues) {
                    var uniqueValuesMap = {};

                    breaks.forEach(function (breakInfo) {
                        uniqueValuesMap[breakInfo.value] = breakInfo;
                    });

                    graphics.forEach(function (graphic) {
                        var attributes = graphic.attributes;

                        var symbolInfo = uniqueValuesMap[attributes[field]];
                        if (symbolInfo) {
                            graphic.symbol = _this.getProperSymbol(geometryType, Object.assign({}, defaultSymbol, symbolInfo), graphic.symbol);
                            Object.assign(symbolInfo, defaultSymbol);
                        }
                    });
                } else {
                    graphics.forEach(function (graphic) {
                        var attributes = graphic.attributes;

                        var value = attributes[field];
                        var currentInfo = void 0;
                        for (var _iterator2 = breaks, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                            var _ref3;

                            if (_isArray2) {
                                if (_i2 >= _iterator2.length) break;
                                _ref3 = _iterator2[_i2++];
                            } else {
                                _i2 = _iterator2.next();
                                if (_i2.done) break;
                                _ref3 = _i2.value;
                            }

                            var breakInfo = _ref3;

                            if (value >= breakInfo.minValue && value < breakInfo.maxValue) {
                                currentInfo = breakInfo;
                                break;
                            } else if (value > breakInfo.minValue && value <= breakInfo.maxValue) {
                                currentInfo = breakInfo;
                                break;
                            }
                        }
                        if (currentInfo) {
                            graphic.symbol = _this.getProperSymbol(geometryType, Object.assign({}, defaultSymbol, currentInfo), graphic.symbol);
                            Object.assign(currentInfo, defaultSymbol);
                        }
                    });
                }
            };

            if (shape) {
                var dynamicBreaks = shape.dynamicBreaks,
                    field = shape.field,
                    custom = shape.custom;

                var shapeBreaks = custom || _this.getBreaks(dynamicBreaks, field, responseId);
                multipleLegend.shapes = shapeBreaks;

                applySymbolInfo(shapeBreaks, field);
            }

            if (color) {
                var _dynamicBreaks = color.dynamicBreaks,
                    _field = color.field,
                    _custom = color.custom;

                var colorBreaks = _custom || _this.getBreaks(_dynamicBreaks, _field, responseId);
                multipleLegend.colors = colorBreaks;

                applySymbolInfo(colorBreaks, _field);
            }

            if (size) {
                var _dynamicBreaks2 = size.dynamicBreaks,
                    _field2 = size.field,
                    _custom2 = size.custom;

                var sizeBreaks = _custom2 || _this.getBreaks(_dynamicBreaks2, _field2, responseId);
                multipleLegend.size = sizeBreaks;

                applySymbolInfo(sizeBreaks, _field2);
            }

            _this.dispatch(_actions2.default.layersActions.legendCreated('multiple', layerInstance.layerId, multipleLegend));
        };

        this.buildBreaksRenderer = function (layerInstance, renderer, response) {

            var rendererClass = new ESRI().BreaksRenderer(null, renderer.field);
            var shape = renderer.shape,
                borderColor = renderer.borderColor,
                borderWidth = renderer.borderWidth;

            var breaks = renderer.breaks || _this.getThematicBreaks(layerInstance, renderer);
            breaks.forEach(function (breakConfig) {
                var minValue = breakConfig.minValue,
                    maxValue = breakConfig.maxValue;

                breakConfig.shape = shape;
                breakConfig.borderColor = borderColor;
                breakConfig.borderWidth = borderWidth;
                rendererClass.addBreak(minValue, maxValue, _this.getProperSymbol(response.geometryType, breakConfig));
            });

            if (!renderer.breaks) {
                _this.dispatch(_actions2.default.layersActions.legendCreated('breaks', layerInstance.layerId, breaks));
            }

            return rendererClass;
        };

        this.getBreaks = function (config, field, responseId) {
            var response = _this.responses[responseId];
            var features = response.features;
            var classification = config.classification,
                breakCount = config.breakCount,
                colors = config.colors,
                minSize = config.minSize,
                maxSize = config.maxSize,
                precision = config.precision,
                shapes = config.shapes;

            var values = [],
                breaks = [];
            var isNumber = true;

            features.forEach(function (feature) {
                try {
                    var value = _FeatureHelper2.default.getAttribute(field, feature.attributes);
                    var valueInNumber = Number(value);
                    var invalidNumber = isNaN(valueInNumber);
                    if (invalidNumber) isNumber = false;
                    values.push(invalidNumber ? value : valueInNumber);
                } catch (e) {
                    console.warn(e);
                }
            });

            var stats = new _geostats2.default(values);
            var breakValues = void 0;
            var isUniqueValues = void 0;

            if (!isNumber && classification !== 'Unique Values' || !values.length) {
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

            var setPrecision = function setPrecision(value) {
                return precision !== undefined ? Number(value.toFixed(precision)) : value;
            };

            var iterateFunction = void 0;

            if (colors) {
                while (colors.length < 2) {
                    colors.push(colors[0] || 'blue');
                }

                var colorRamp = _chromaJs2.default.scale(colors).colors(breakCount);

                iterateFunction = function iterateFunction(breakValue, index) {

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
                };
            } else if (minSize !== undefined && maxSize !== undefined) {
                var sizeBreaks = [];
                sizeBreaks.push(minSize);

                var sizeInterval = (maxSize - minSize) / (breakCount - 1);

                for (var count = 1; count < breakCount - 1; count++) {
                    sizeBreaks.push(minSize + sizeInterval * count);
                }

                sizeBreaks.push(maxSize);

                iterateFunction = function iterateFunction(breakValue, index) {

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
                };
            } else if (shapes) {

                if (!shapes.length) {
                    shapes = ['square'];
                }

                var shapeIndex = 0;

                iterateFunction = function iterateFunction(breakValue, index) {

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
                };
            }

            breakValues.forEach(iterateFunction);

            return breaks;
        };

        this.buildSimpleRenderer = function (layerInstance, renderer, response) {
            var symbolConfig = Object.assign({
                color: '#3f51b5',
                size: 14,
                borderColor: 'black',
                borderWidth: 2,
                shape: 'square'
            }, renderer);

            _this.dispatch(_actions2.default.layersActions.legendCreated('values', layerInstance.layerId, [{
                value: layerInstance.title,
                color: symbolConfig.color,
                borderColor: symbolConfig.borderColor,
                shape: symbolConfig.shape,
                borderWidth: symbolConfig.borderWidth
            }]));

            var properSymbol = _this.getProperSymbol(response.geometryType, symbolConfig);
            return new ESRI().SimpleRenderer(properSymbol);
        };

        this.buildUniqueValuesRenderer = function (layerInstance, renderer, response) {
            var uniqueValues = renderer.uniqueValues,
                field = renderer.field,
                label = renderer.label,
                dynamicValues = renderer.dynamicValues;


            var properUniqueValues = {};
            if (dynamicValues) {
                var features = response.features;
                var colors = dynamicValues.colors;

                var shapes = dynamicValues.shapes || ['circle'];
                var foundUniqueValues = {};

                features.forEach(function (feature) {
                    var attributes = feature.attributes;

                    foundUniqueValues[attributes[field]] = true;
                });

                while (colors.length < 2) {
                    colors.push(colors[0] || 'blue');
                }

                var colorRamp = _chromaJs2.default.scale(colors).colors(Object.keys(foundUniqueValues).length);

                var uniqueValueIndex = 0;
                var shapeIndex = 0;

                for (var uniqueValue in foundUniqueValues) {
                    var _FeatureHelper$getSin;

                    var shape = shapes && shapes[shapeIndex];
                    properUniqueValues[uniqueValue] = {
                        value: label ? _FeatureHelper2.default.getSingleMetricRegex(label, (_FeatureHelper$getSin = {}, _FeatureHelper$getSin[field] = uniqueValue, _FeatureHelper$getSin)) || uniqueValue : uniqueValue,
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

            var defaultSymbol = _this.getProperSymbol(response.geometryType, { color: 'transparent', borderWidth: 0, borderColor: 'transparent' });

            var uniqueRenderer = new ESRI().UniqueValueRenderer(defaultSymbol, field);
            var legendValues = [];

            for (var value in properUniqueValues) {
                var _FeatureHelper$getSin2;

                var config = properUniqueValues[value];
                legendValues.push({
                    value: label ? _FeatureHelper2.default.getSingleMetricRegex(label, (_FeatureHelper$getSin2 = {}, _FeatureHelper$getSin2[field] = value, _FeatureHelper$getSin2)) || value : value,
                    color: config.color,
                    shape: config.shape,
                    borderColor: config.borderColor,
                    borderWidth: config.borderWidth
                });
                uniqueRenderer.addValue(value, _this.getProperSymbol(response.geometryType, config));
            }

            _this.dispatch(_actions2.default.layersActions.legendCreated('values', layerInstance.layerId, legendValues));

            return uniqueRenderer;
        };

        this.getProperSymbol = function (geometryType, breakConfig, symbol) {

            var properSymbol = void 0;

            switch (geometryType) {
                case 'esriGeometryPolygon':
                    properSymbol = _this.getSimpleFillSymbol(breakConfig, symbol);
                    break;
                case 'esriGeometryPoint':
                    properSymbol = _this.getSimpleMarkerSymbol(breakConfig, symbol);
                    break;
            }

            properSymbol._symbolInfo = properSymbol._symbolInfo || [];
            properSymbol._symbolInfo.push(breakConfig);
            return properSymbol;
        };

        this.getSimpleFillSymbol = function (_ref4, existingSymbol) {
            var color = _ref4.color,
                borderColor = _ref4.borderColor,
                borderWidth = _ref4.borderWidth;

            var symbol = existingSymbol || new ESRI().SimpleFillSymbol();
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

        this.getSimpleMarkerSymbol = function (_ref5, existingSymbol) {
            var color = _ref5.color,
                size = _ref5.size,
                shape = _ref5.shape,
                borderColor = _ref5.borderColor,
                borderWidth = _ref5.borderWidth;

            var symbol = existingSymbol || new ESRI().SimpleMarkerSymbol();
            var style = void 0;

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

        this.getThematicBreaks = function (layerInstance, renderer) {
            var dynamicBreaks = renderer.dynamicBreaks,
                field = renderer.field;
            var classification = dynamicBreaks.classification,
                breakCount = dynamicBreaks.breakCount,
                colors = dynamicBreaks.colors,
                minSize = dynamicBreaks.minSize,
                maxSize = dynamicBreaks.maxSize,
                precision = dynamicBreaks.precision;

            var responseId = (0, _objectHash2.default)({ layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource });

            var colorBreaks = _this.getBreaks({
                classification: classification,
                breakCount: breakCount,
                colors: colors,
                precision: precision
            }, field, responseId);

            if (minSize !== undefined && maxSize !== undefined) {
                var sizeBreaks = _this.getBreaks({
                    classification: classification,
                    breakCount: breakCount,
                    minSize: minSize,
                    maxSize: maxSize,
                    precision: precision
                }, field, responseId);

                colorBreaks.forEach(function (breakConfig, index) {
                    breakConfig.size = sizeBreaks[index].size;
                });
            }

            return colorBreaks;
        };

        if (_scope2.default.API) {
            return;
        }

        if (authentication && authentication.arcgis) {
            var _authentication$arcgi = authentication.arcgis,
                appId = _authentication$arcgi.appId,
                portalUrl = _authentication$arcgi.portalUrl;

            var info = new ESRI().OAuthInfo({ appId: appId, portalUrl: portalUrl });
            var esriId = ESRI().IdentityManager;

            esriId.registerOAuthInfos([info]);

            var def = esriId.getCredential(info.portalUrl + '/sharing');

            def.then(function (auth) {

                var hashObject = {
                    '#access_token': auth.token,
                    expires_in: auth.expires,
                    username: auth.userId,
                    ssl: auth.ssl,
                    portalUrl: auth.server
                };

                var _hash = _qs2.default.stringify(hashObject);

                window.localStorage.setItem('brintell-esri-map-token', auth.token);

                esriId.setOAuthResponseHash(_hash);
            }).otherwise(function (error) {
                console.log(error);
            });
        }

        this.canvas = canvas;
        this.dispatch = dispatch;
        this.map = new ESRI().Map(mapTarget, options);
        this.map.on('click', function (event) {
            var graphic = event.graphic;

            if (graphic) {
                var _layer = graphic._layer,
                    attributes = graphic.attributes,
                    symbol = graphic.symbol;

                var layerInstance = _layer.layerInstance;
                _this.dispatch(_actions2.default.mapActions.featureClick(attributes, graphic.fields, layerInstance.layerId, symbol._symbolInfo));
            } else {
                _this.dispatch(_actions2.default.mapActions.mapClick());
            }
        });
        this.map.on('extent-change', function (event) {
            _this.queue(function () {
                _this.dispatch(_actions2.default.mapActions.mapExtentChange());
            });
        });
        this.map.on('zoom-end', function (event) {
            _this.queue(function () {
                _this.dispatch(_actions2.default.mapActions.mapZoomChange());
            });
        });
        this.map.on('pan-start', function (event) {
            _this.queue(function () {
                _this.dispatch(_actions2.default.mapActions.panStarted());
            });
        });
        this.map.on('resize', function (event) {
            _this.queue(function () {
                _this.dispatch(_actions2.default.mapActions.mapResized());
            });
        });

        this.snapManager = this.map.enableSnapping();
        this.drawingTool = new ESRI().Draw(this.map);
        this.drawingTool.on('draw-complete', this.onDrawingComplete);

        try {
            var measurementTarget = document.querySelector('.measurement-widget #measurement-widget');
            this.measurement = new ESRI().Measurement({
                map: this.map
            }, measurementTarget);
            this.measurement.hide();
            this.measurement.startup();
        } catch (err) {
            console.warn(err);
        }

        _scope2.default.API = this;
    }

    ESRIMap.prototype.drawFilter = function drawFilter() {
        this.drawingTool.activate(ESRI().Draw['FREEHAND_POLYGON']);
    };

    ESRIMap.prototype.deactivateDrawFilter = function deactivateDrawFilter() {
        this.drawingTool.deactivate();
    };

    ESRIMap.prototype.changeZoom = function changeZoom(newZoom) {
        this.map.setZoom(newZoom);
    };

    ESRIMap.prototype.changeBasemap = function changeBasemap(basemap) {
        this.map.setBasemap(basemap);
    };

    ESRIMap.prototype.removeLayer = function removeLayer(layerId) {
        var layer = this.layers[layerId];
        if (layer && this.map) {
            this.map.removeLayer(layer);
            delete this.layers[layerId];
            delete this.activeLayers[layerId];
        }
    };

    ESRIMap.prototype.getZoom = function getZoom() {
        return this.map.getZoom();
    };

    ESRIMap.prototype.centerAtLayer = function centerAtLayer(layerInstanceId) {
        var _this2 = this;

        var layer = this.layers[layerInstanceId];
        if (layer) {
            var extent = layer.fullExtent;
            if (extent) {
                this.map.setExtent(extent, true).then(function () {
                    setTimeout(function () {
                        _this2.dispatch(_actions2.default.mapActions.zoomChange(null, _this2.map.getZoom()));
                    }, 0);
                });
            }
        }
    };

    ESRIMap.prototype.buildLayer = function buildLayer(layerInstance, enrichedSource) {
        var _this3 = this;

        var promise = void 0;

        switch (layerInstance.type) {
            case 'Feature Layer':
                promise = this.buildFeatureLayer(layerInstance, enrichedSource);
                break;
            default:
                promise = this.buildCustomLayer(layerInstance, enrichedSource);
                break;
        }

        promise.then(function (layer) {
            layer.setOpacity(layerInstance.opacity / 100);
            _this3.map.addLayer(layer);
            layer.on('mouse-over', function (mouseOverEvent) {

                var pageX = mouseOverEvent.pageX;
                var pageY = mouseOverEvent.pageY;

                var onMouseMoveListener = layer.on('mouse-move', function (mouseMoveEvent) {
                    pageX = mouseMoveEvent.pageX;
                    pageY = mouseMoveEvent.pageY;
                });

                var mouseOverTimeout = setTimeout(function () {
                    var graphic = mouseOverEvent.graphic;

                    if (graphic) {
                        var _layer = graphic._layer,
                            attributes = graphic.attributes;

                        var _layerInstance = _layer.layerInstance;
                        var graphicId = _this3.getGraphicHash(graphic);
                        _this3.generateHighlightHelper(graphic);
                        _this3.graphicAttributes[graphicId] = attributes;
                        _this3.dispatch(_actions2.default.mapActions.featureHover(graphicId, _layerInstance.layerId, attributes, { x: pageX, y: pageY }));
                    }
                }, 600);
                var onMouseOutListener = layer.on('mouse-out', function () {
                    setTimeout(function () {
                        _this3.dispatch(_actions2.default.mapActions.mouseOutOfFeature());
                    }, 50);
                    onMouseOutListener.remove();
                    onMouseMoveListener.remove();
                    clearTimeout(mouseOverTimeout);
                });
            });
            _this3.activeLayers[layerInstance.layerId] = true;
            _this3.layers[layerInstance.layerId] = layer;
            _this3.layers[layerInstance.layerId].layerInstance = layerInstance;
            if (layer.fullExtent && layer.fullExtent.xmax !== undefined) {
                // this.centerAtLayer(layerInstance.layerId);
            } else {
                var updateListener = layer.on('update', function () {
                    // this.centerAtLayer(layerInstance.layerId);
                    updateListener.remove();
                });
            }
        });

        promise.catch(function (error) {
            _this3.dispatch(_actions2.default.layersActions.layerBuilt(layerInstance.layerId, error));
        });
    };

    ESRIMap.prototype.buildFeatureLayer = function buildFeatureLayer(layerInstance, enrichedSource) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
            try {

                var featureLayer = new ESRI().FeatureLayer(enrichedSource.url, {
                    mode: ESRI().FeatureLayer.MODE_SNAPSHOT,
                    outFields: enrichedSource.params && enrichedSource.params.outFields && enrichedSource.params.outFields.split(',')
                });

                var loadListener = featureLayer.on('load', function () {
                    try {
                        loadListener.remove();
                        _this4.dispatch(_actions2.default.layersActions.layerBuilt(layerInstance.layerId));
                        var renderer = featureLayer.renderer;

                        if (renderer) {
                            var values = [];
                            if (renderer.symbol) {
                                var color = renderer.symbol.color;
                                values.push({
                                    value: 'Unique Symbol',
                                    color: color ? color.toRgba() : undefined
                                });
                                _this4.dispatch(_actions2.default.layersActions.legendCreated('values', layerInstance.layerId, values));
                            } else if (renderer.infos) {
                                renderer.infos.map(function (info) {
                                    try {
                                        var _info$symbol = info.symbol,
                                            _color = _info$symbol.color,
                                            url = _info$symbol.url;


                                        values.push({
                                            value: info.label || info.value,
                                            color: _color && _color.toRgba ? _color.toRgba() : undefined,
                                            url: url
                                        });
                                    } catch (e) {
                                        console.warn(e);
                                    }
                                });
                                _this4.dispatch(_actions2.default.layersActions.legendCreated('values', layerInstance.layerId, values));
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
    };

    ESRIMap.prototype.reorderLayers = function reorderLayers(layersOrder) {
        var _this5 = this;

        var reverseOrder = layersOrder.slice().reverse();
        reverseOrder.forEach(function (layerId, index) {
            var layer = _this5.layers[layerId];
            if (layer) {
                _this5.map.reorderLayer(layer, index);
            }
        });
    };

    ESRIMap.prototype.toggleRuler = function toggleRuler(value) {
        if (value) {
            window.document.body.classList.add('calcite');
            this.measurement.show();
        } else {
            window.document.body.classList.remove('calcite');
            this.measurement.hide();
        }
    };

    ESRIMap.prototype.buildCustomLayer = function buildCustomLayer(layerInstance, enrichedSource) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
            try {
                var promise = _GeoService2.default.query(enrichedSource);
                promise.then(function (response) {
                    setTimeout(function () {
                        _this6.dispatch(_actions2.default.appActions.generateMetaData({ enrichedSourceResponse: response, enrichedSourceId: enrichedSource.id }));
                    }, 0);
                    try {
                        _this6.responses[(0, _objectHash2.default)({ layerId: layerInstance.layerId, enrichedSourceId: layerInstance.enrichedSource })] = response;
                        var featureSet = new ESRI().FeatureSet(response);
                        var featureLayer = new ESRI().FeatureLayer({
                            layerDefinition: response,
                            featureSet: featureSet
                        });

                        var finishBuilding = function finishBuilding() {

                            if (featureLayer.graphics.length) {
                                var loadListener = featureLayer.on('update', function () {
                                    featureLayer.fullExtent = ESRI().graphicsUtils.graphicsExtent(featureLayer.graphics);
                                    _this6.dispatch(_actions2.default.layersActions.layerBuilt(layerInstance.layerId));
                                    loadListener.remove();
                                });
                            } else {
                                _this6.dispatch(_actions2.default.layersActions.layerBuilt(layerInstance.layerId));
                            }

                            resolve(featureLayer);
                        };

                        switch (layerInstance.type) {
                            case 'custom':
                            case 'Custom':
                                _this6.applyCustomTheming(featureLayer, layerInstance, response);
                                finishBuilding();
                                break;
                            case 'Stacked Bubble':
                                var _promise = _this6.applyStackedBubbleSymbology(featureLayer, layerInstance);
                                _promise.then(finishBuilding);
                                _promise.catch(reject);
                                break;
                            default:
                                var renderer = _this6.buildRenderer(layerInstance, response);
                                featureLayer.setRenderer(renderer);
                                finishBuilding();
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
                promise.catch(function (error) {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    ESRIMap.prototype.toggleLayer = function toggleLayer(id, value) {

        if (!this.layers[id]) return;

        if (value) {
            this.activeLayers[id] = true;
            this.layers[id].show();
        } else {
            this.activeLayers[id] = false;
            this.layers[id].hide();
        }
    };

    ESRIMap.prototype.changeLayerOpacity = function changeLayerOpacity(id, opacity) {
        if (!this.layers[id]) return;
        this.layers[id].setOpacity(opacity / 100);
    };

    return ESRIMap;
}();

exports.default = ESRIMap;
module.exports = exports['default'];