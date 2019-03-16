import update from "immutability-helper";
import {arrayMove} from 'react-sortable-hoc';
import LayersModule from '../container-components/layers-module';
import CatalogModule from '../container-components/catalog-module';
import ManageWorkspacesModule from '../container-components/manage-workspaces-module';
import InfoModule from '../container-components/info-module';
import MeasurementModule from '../presentational-components/measurement-module';
import SCOPE from '../scope';
import hash from 'object-hash';

const API = () => {
    return SCOPE.API;
};

const initialState = {
    "panels": [
        {
            title: 'PANEL.WORKSPACE',
            icon: 'Toc',
            ModuleClass: LayersModule
        },
        {
            title: 'PANEL.LAYERS_CATALOG',
            icon: 'Layers',
            ModuleClass: CatalogModule
        },
        {
            title: 'PANEL.INFO_PANEL',
            icon: 'InfoOutline',
            ModuleClass: InfoModule
        },
        {
            title: 'PANEL.MEASUREMENT',
            icon: 'Ruler',
            ModuleClass: MeasurementModule
        },
        {
            title: 'PANEL.MANAGE_WORKSPACES',
            icon: 'FolderSpecial',
            ModuleClass: ManageWorkspacesModule,
            bottom: true
        }
    ],
    "currentModule": "PANEL.WORKSPACE",
    "currentWorkspaceSelection": [],
    "navOpened": false,
    "featureInfo": {},
    "dataToLayersListeners": {},
    "mapLoaded": false,
    "zoom": 4,
    "customizeLayer": {
        "1": {
            "color": {
                "field": "RENDA",
                "custom": [],
                "dynamicBreaks": {
                    "classification": "Jenks",
                    "breakCount": 4,
                    "colors": ["red", "orange", "yellow", "green"]
                }
            }
        }
    },
    "rulerEnabled": false,
    "mouseOnFeature": false,
    "basemap": "gray",
    "hoverShown": false,
    "hoverPosition": {},
    "hoverAttributes": {},
    "allPrompts": {},
    "appliedToFilter": {},
    "selectedFeatures": {},
    "partialSelectedFeatures": {},
    "layers": {},
    "workspaces": {},
    "currentWorkspace": 0,
    "enrichedSources": {},
    "enrichedSourcesResponses": {},
    "metaData": {}
};

const applyFilters = (state) => {
    try {
        const {appliedToFilter, allPrompts} = state;
        if (SCOPE.onFilter) {

            console.log(SCOPE)
            const promptState = {};
            const prompts = [];

            for (let graphicId in appliedToFilter) {
                const promptMap = appliedToFilter[graphicId];
                for (let prompt in promptMap) {
                    promptState[prompt] = promptState[prompt] || {};
                    promptState[prompt][promptMap[prompt]] = true;
                }
            }

            for (let promptName in allPrompts) {
                promptState[promptName] = promptState[promptName] || {};
            }

            for (let promptName in promptState) {
                const values = Object.keys(promptState[promptName]).map(value => value === "undefined" ? '' : value);
                prompts.push({
                    prompt: promptName,
                    value: values
                });
            }

            SCOPE.onFilter(prompts);
        }
    } catch (error) {
        console.error(error);
    }
};

const applyZoomRange = (zoomChangeState) => {
    const currentWorkspace = zoomChangeState.workspaces[zoomChangeState.currentWorkspace];
    const currentZoom = API() ? API().getZoom() : zoomChangeState.zoom;
    for (let layerId in currentWorkspace.layers) {
        const {minZoom, maxZoom} = currentWorkspace.layers[layerId];
        if (minZoom !== undefined && maxZoom !== undefined) {
            zoomChangeState = update(zoomChangeState, {
                workspaces: {
                    [zoomChangeState.currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                insideZoomRange: {
                                    $set: currentZoom >= minZoom && currentZoom <= maxZoom
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    return zoomChangeState;
};

const mainReducer = (state = initialState, action) => {

    const {
        layers,
        enrichedSources,
        dataToLayersListeners,
        zoom,
        rulerEnabled,
        popupFixed,
        mouseOverPopup,
        hoverShown,
        hoverConfig,
        workspaces,
        currentWorkspace,
        currentWorkspaceSelection,
        mouseOverFeature,
        selectedFeatures,
        partialSelectedFeatures,
        appliedToFilter,
        customizeLayer,
        enrichedSourcesResponses,
    } = state;

    const payload = action.payload || {};

    const {
        value,
        map,
        layerId,
        dataId,
        newData,
        error,
        legendType,
        legend,
        opacity,
        itemId,
        oldIndex,
        newIndex,
        insideZoomRange,
        increase,
        newZoom,
        basemap,
        authentication,
        attributes,
        position,
        force,
        workspaceSelection,
        workspaceId,
        symbolInfo,
        fields,
        graphicId,
        withoutApply,
        type,
        customRenderer,
        field,
        originalType,
        enrichedSourceResponse,
        enrichedSourceId,
        defaultRenderer
    } = payload;

    const _currentWorkspace = workspaces[currentWorkspace] || {};
    const _layers = _currentWorkspace.layers || {};
    const layer = _layers[layerId] || {};
    const layersOrder = _currentWorkspace.layersOrder;
    const partialSelectedFeaturesKeys = Object.keys(partialSelectedFeatures);
    const selectedFeaturesKeys = Object.keys(selectedFeatures);
    const finalSelectedFeatures = Object.assign({}, selectedFeatures, partialSelectedFeatures);
    const nextWorkspace = workspaces[workspaceId];

    switch (action.type) {
        case 'GENERATE_METADATA':
            const newMetadata = {};
            const {features} = enrichedSourceResponse;
            if (features && features.length) {
                const missingValues = {};
                let missingValuesCount = 0;
                for (let feature of features) {
                    const {attributes} = feature;
                    for (let key in attributes) {
                        let value = attributes[key];
                        if (!value) {
                            if (missingValues[key] === undefined) {
                                missingValuesCount++;
                            }
                            missingValues[key] = true;
                        } else {
                            newMetadata[key] = typeof value;
                            if (missingValues[key]) {
                                missingValuesCount--;
                            }
                            missingValues[key] = false;
                        }
                    }
                    if (missingValuesCount === 0) {
                        break;
                    }
                }
            }
            return update(state, {
                metaData: {
                    [enrichedSourceId]: {
                        $set: newMetadata
                    }
                }
            });

        case 'CUSTOMIZE_LEGEND':
            const layerRenderer = JSON.parse(JSON.stringify(layer.renderer));
            const rendererType = layerRenderer[type];
            if (rendererType.dynamicBreaks && !rendererType.custom) {
                rendererType.custom = API().getBreaks(rendererType.dynamicBreaks, rendererType.field, hash({layerId, enrichedSourceId: layer.enrichedSource}));
            }
            return update(state, {
                customizeLayer: {
                    [layerId]: {
                        $set: layerRenderer
                    }
                }
            });
        case 'APPLY_CUSTOM_RENDERER':
            let applyCustomRendererState = state;
            API().removeLayer(layerId);
            if (originalType !== type) {
                applyCustomRendererState = update(state, {
                    workspaces: {
                        [currentWorkspace]: {
                            layers: {
                                [layerId]: {
                                    renderer: {
                                        $unset: [originalType]
                                    }
                                }
                            }
                        }
                    }
                });
            }
            return update(applyCustomRendererState, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                built: {
                                    $set: false
                                },
                                renderer: {
                                    [type]: {
                                        $set: customRenderer
                                    },
                                    default: defaultRenderer ? {$set: defaultRenderer} : {},
                                    $unset: ['multiple']
                                }
                            }
                        }
                    }
                }
            });
        case 'BOOTSTRAP':
            let bootstrapState = update(state, {
                layers: {
                    $set: payload.layers
                },
                enrichedSources: {
                    $set: payload.enrichedSources
                },
                workspaces: {
                    $set: payload.workspaces
                },
                currentWorkspaceSelection: {
                    $set: payload.currentWorkspaceSelection
                },
                currentWorkspace: {
                    $set: payload.currentWorkspace
                },
                data: {
                    $set: payload.data
                },
                dataToLayersListeners: {
                    $set: payload.dataToLayersListeners
                }
            });

            for (let option in map) {
                bootstrapState = update(bootstrapState, {
                    [option]: {
                        $set: map[option]
                    }
                });
            }

            if (authentication) {
                bootstrapState = update(bootstrapState, {
                    authentication: {
                        $set: authentication
                    }
                });
            }
            if (map.navOpened !== undefined) {
                bootstrapState = update(bootstrapState, {
                    navOpened: {
                        $set: map.navOpened
                    }
                });
            }
            return applyZoomRange(bootstrapState);
        case 'RECALCULATE_BREAKS':
            const customizeRenderer = JSON.parse(JSON.stringify(customizeLayer[layerId]));
            if (type !== originalType) {
                customizeRenderer[type] = customRenderer;
            }
            const currentType = customizeRenderer[type];
            currentType.custom = API().getBreaks(customRenderer.dynamicBreaks, customRenderer.field, hash({layerId, enrichedSourceId: layer.enrichedSource}));
            currentType.dynamicBreaks = customRenderer.dynamicBreaks;
            return update(state, {
                customizeLayer: {
                    [layerId]: {
                        $set: customizeRenderer
                    }
                }
            });
        case 'CLEAR_PARTIAL_FILTER_SELECTION':
            return update(state, {
                partialSelectedFeatures: {
                    $unset: partialSelectedFeaturesKeys
                }
            });
        case 'CLEAR_APPLIED_FILTER_SELECTIONS':
            if (selectedFeaturesKeys.length === 0) return state;

            for (let _graphicId in selectedFeatures) {
                API().clearHighlight(_graphicId);
            }

            let clearAppliedFilterState = update(state, {
                selectedFeatures: {
                    $unset: selectedFeaturesKeys
                },
                appliedToFilter: {
                    $unset: selectedFeaturesKeys
                }
            });
            if (!withoutApply) {
                applyFilters(clearAppliedFilterState);
            }
            return clearAppliedFilterState;
        case 'APPLY_FILTER_SELECTION':

            let newApplyFilterState = state;
            const updatedAppliedToFilter = {};
            for (let _graphicId in finalSelectedFeatures) {
                const promptsApplied = {};
                API().highlight(_graphicId);
                const _layerId = finalSelectedFeatures[_graphicId];
                const _attributes = API().getGraphicAttributes(_graphicId);
                const _layer = _currentWorkspace.layers[_layerId];
                const promptConfig = _layer.promptConfig || [];
                promptConfig.forEach((config) => {
                    const {prompt, metric} = config;
                    newApplyFilterState = update(newApplyFilterState, {
                        allPrompts: {
                            [prompt]: {
                                $set: true
                            }
                        }
                    });
                    promptsApplied[prompt] = _attributes[metric];
                });
                newApplyFilterState = update(newApplyFilterState, {
                    selectedFeatures: {
                        [_graphicId]: {
                            $set: _layerId
                        }
                    }
                });
                updatedAppliedToFilter[_graphicId] = promptsApplied;
            }

            for (let _graphicId in appliedToFilter) {
                if (!updatedAppliedToFilter[_graphicId]) {
                    API().clearHighlight(_graphicId);
                }
            }

            newApplyFilterState = update(newApplyFilterState, {
                appliedToFilter: {
                    $set: updatedAppliedToFilter
                },
                partialSelectedFeatures: {
                    $unset: partialSelectedFeaturesKeys
                }
            });
            applyFilters(newApplyFilterState);
            return newApplyFilterState;
        case 'WORKSPACE_SELECTION_CHANGE':
            return update(state, {
                currentWorkspaceSelection: {
                    $set: workspaceSelection
                }
            });
        case 'REMOVE_LAYER_FROM_WORKSPACE':
            API().removeLayer(layerId);
            const removeLayerState = update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            $unset: [layerId]
                        },
                        layersOrder: {
                            $splice: [[_currentWorkspace.layersOrder.indexOf(layerId), 1]]
                        }
                    }
                }
            });
            return removeLayerState;
        case 'ADD_LAYER':
            return update(state, {
                currentModule: {
                    $set: 'PANEL.LAYERS_CATALOG'
                }
            });
        case 'WORKSPACE_SELECTION_APPLY':
            const updatedWorkspaceLayers = {};
            const updatedLayersOrder = [];
            currentWorkspaceSelection.forEach((_layerId) => {
                if (_currentWorkspace.layers[_layerId]) {
                    updatedWorkspaceLayers[_layerId] = _currentWorkspace.layers[_layerId];
                } else {
                    updatedWorkspaceLayers[_layerId] = Object.assign({workspaceId: currentWorkspace}, layers[_layerId]);
                }
                updatedLayersOrder.push(_layerId);
            });

            for (let _layerId in _currentWorkspace.layers) {
                if (!updatedWorkspaceLayers[_layerId]) {
                    API().removeLayer(_layerId);
                }
            }

            const workspaceSelectionApplyState = update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            $set: updatedWorkspaceLayers
                        },
                        layersOrder: {
                            $set: updatedLayersOrder
                        }
                    }
                },
                currentModule: {
                    $set: 'PANEL.WORKSPACE'
                }
            });

            return applyZoomRange(workspaceSelectionApplyState);
        case 'TOGGLE_RULER':
            let nextModule;
            if (value) {
                nextModule = 'Measurement';
            } else {
                nextModule = state.currentModule === 'Measurement' ? 'Map Layers' : state.currentModule
            }

            const enabledRuler = value !== undefined ? value : !rulerEnabled;
            API().toggleRuler(enabledRuler);
            return update(state, {

            });

            return update(state, {
                currentModule: {
                    $set: nextModule
                },
                rulerEnabled: {
                    $set: enabledRuler
                }
            });
        case 'SELECTED_FEATURE_CHANGE':
            if (value) {
                return update(state, {
                    partialSelectedFeatures: {
                        [graphicId]: {
                            $set: String(layerId)
                        }
                    }
                });
            } else {
                return update(state, {
                    partialSelectedFeatures: {
                        $unset: [graphicId]
                    },
                    selectedFeatures: {
                        $unset: [graphicId]
                    }
                });
            }
        case "CHANGE_CURRENT_MODULE":
            const module = payload.module;
            return update(state, {
                currentModule: {
                    $set: module
                },
                navOpened: {
                    $set: state.currentModule !== module ? true : !state.navOpened
                }
            });
        case 'DATA_CHANGE':
            let newStateDataChange = update(state, {
                data: {
                    [dataId]: {
                        $set: newData
                    }
                }
            });

            const affectedInstances = dataToLayersListeners[dataId] || [];
            const layersUpdate = {};

            affectedInstances.forEach(layerId => {

                if (_layers[layerId]) {
                    API().removeLayer(layerId);
                    layersUpdate[layerId] = {
                        built: {
                            $set: false
                        }
                    }
                }

            });

            return update(newStateDataChange, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: layersUpdate,
                    }
                }
            });
        case 'CHANGE_LAYER_OPACITY':
            API().changeLayerOpacity(layerId, opacity);
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                opacity: {
                                    $set: opacity
                                }
                            }
                        }
                    }
                }
            });
        case 'REORDER_LAYER':
            const newArrayGroup = arrayMove(layersOrder, oldIndex, newIndex);
            const newStateReorderLayerGroup = update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layersOrder: {
                            $set: newArrayGroup
                        }
                    }
                }
            });
            API().reorderLayers(newArrayGroup);
            return newStateReorderLayerGroup;
        case 'CENTER_LAYER':
            API().centerAtLayer(layerId);
            return state;
        case 'TOGGLE_EXPANDED':
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                expanded: {
                                    $set: !layer.expanded
                                }
                            }
                        }
                    }
                }
            });
        case 'TOGGLE_GROUP_EXPANDED':
            return update(state, {
                layers: {
                    [layerId]: {
                        expanded: {
                            $set: !layer.expanded
                        }
                    }
                }
            });
        case "TOGGLE_GROUP":
            const groupEnabled = !items[itemId].enabled;
            const groupLayers = groupsOrder[itemId];
            let toggleGroupState = update(state, {
                items: {
                    [itemId]: {
                        enabled: {
                            $set: groupEnabled
                        }
                    }
                }
            });
            groupLayers.forEach((_layerId) => {
                toggleGroupState = update(toggleGroupState, {
                    layers: {
                        [_layerId]: {
                            enabled: {
                                $set: groupEnabled
                            }
                        }
                    }
                });
                API().toggleLayer(layers[_layerId].currentInstance, groupEnabled);
            });
            return toggleGroupState;
        case "TOGGLE_LAYER":
            const layerEnabled = !layer.enabled;

            API().toggleLayer(layerId, layerEnabled);
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                enabled: {
                                    $set: layerEnabled
                                }
                            }
                        }
                    }
                }
            });
        case 'BUILD_LAYER':
            API().buildLayer(layer, enrichedSources[layer.enrichedSource]);
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                building: {
                                    $set: true
                                }
                            }
                        }
                    }
                }
            });
        case 'LEGEND_CREATED':
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                renderer: {
                                    [legendType]: {
                                        $set: legend
                                    }
                                }
                            }
                        }
                    }
                }
            });
        case 'SHOW_LAYER':
            API().toggleLayer(layerId, insideZoomRange);
            return state;
        case 'MAP_ZOOM_CHANGE':
            const mapZoomChangeState = applyZoomRange(state);
            return update(mapZoomChangeState, {
                zoom: {
                    $set: API().getZoom()
                }
            });
        case 'LAYER_BUILT':
            API().reorderLayers(_currentWorkspace.layersOrder);
            if (error) console.error(error);
            return update(state, {
                workspaces: {
                    [currentWorkspace]: {
                        layers: {
                            [layerId]: {
                                built: {
                                    $set: true
                                },
                                building: {
                                    $set: false
                                },
                                error: {
                                    $set: error
                                }
                            }
                        }
                    }
                }
            });
        case 'UPDATE_POPUP_POSITION':
            return update(state, {
                popupPosition: {
                    $set: position
                }
            });
        case 'POPUP_CLOSE':
            return update(state, {
                popupShown: {
                    $set: force ? false : mouseOverPopup || popupFixed
                },
                popupFixed: {
                    $set: force !== undefined ? false : popupFixed
                }
            });
        case 'CHANGE_WORKSPACE':
            let workspaceChangeState = state;
            const newWorkspaceSelection = [];

            for (let _layerId in nextWorkspace.layers) {
                newWorkspaceSelection.push(Number(_layerId));
            }

            if (workspaceId !== currentWorkspace) {
                for (let _layerId in _currentWorkspace.layers) {
                    API().removeLayer(_layerId);
                    workspaceChangeState = update(workspaceChangeState, {
                        workspaces: {
                            [currentWorkspace]: {
                                layers: {
                                    [_layerId]: {
                                        built: {
                                            $set: false
                                        },
                                        building: {
                                            $set: false
                                        }
                                    }
                                }
                            }
                        },
                        currentWorkspace: {
                            $set: workspaceId
                        },
                        currentWorkspaceSelection: {
                            $set: newWorkspaceSelection
                        },
                        currentModule: {
                            $set: 'PANEL.WORKSPACE'
                        }
                    });
                }
            }

            return update(workspaceChangeState, {
                currentWorkspace: {
                    $set: workspaceId
                }
            });
        case 'MOUSE_OVER_POPUP':
            return update(state, {
                mouseOverPopup: {
                    $set: value
                },
                hoverShown: {
                    $set: mouseOverFeature || value
                }
            });
        case 'MOUSE_OUT_OF_FEATURE':
            return update(state, {
                mouseOverFeature: {
                    $set: false
                },
                hoverShown: {
                    $set: mouseOverPopup
                }
            });
        case 'FEATURE_HOVER':
            return update(state, {
                hoverShown: {
                    $set: true
                },
                hoverPosition: {
                    $set: position
                },
                hoverAttributes: {
                    $set: attributes
                },
                hoverConfig: {
                    $set: layer.hover
                },
                mouseOverFeature: {
                    $set: true
                },
                hoverGraphicId: {
                    $set: graphicId
                },
                hoverLayerId: {
                    $set: layerId
                },
                hoverPromptConfig: {
                    $set: !!layer.promptConfig
                }
            });
        case 'FEATURE_CLICK':
            return update(state, {
                featureInfo: {
                    $set: {
                        attributes,
                        renderer: layer.renderer,
                        symbolInfo,
                        infoPanel: layer.infoPanel,
                        fields,
                    }
                },
                currentModule: {
                    $set: 'PANEL.INFO_PANEL'
                }
            });
        case 'CHANGE_BASEMAP':
            if (state.basemap === basemap) return state;
            API().changeBasemap(basemap);
            return update(state, {
                basemap: {
                    $set: basemap
                }
            });
        case "ZOOM_CHANGE":
            let evaluatedZoom;
            if (newZoom) {
                evaluatedZoom = newZoom;
            } else {
                evaluatedZoom = increase ? zoom + 1 : zoom - 1;
            }

            API().changeZoom(evaluatedZoom);
            return update(state, {
                zoom: {
                    $set: evaluatedZoom
                },
                // popupShown: {
                //     $set: false
                // }
            });
        case "MAP_LOADED":
            return update(state, {
                mapLoaded: {
                    $set: true
                }
            });
        default:
            return state;
    }
};

export default mainReducer;
