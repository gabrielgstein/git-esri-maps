'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _reactSortableHoc = require('react-sortable-hoc');

var _layersModule = require('../container-components/layers-module');

var _layersModule2 = _interopRequireDefault(_layersModule);

var _catalogModule = require('../container-components/catalog-module');

var _catalogModule2 = _interopRequireDefault(_catalogModule);

var _manageWorkspacesModule = require('../container-components/manage-workspaces-module');

var _manageWorkspacesModule2 = _interopRequireDefault(_manageWorkspacesModule);

var _infoModule = require('../container-components/info-module');

var _infoModule2 = _interopRequireDefault(_infoModule);

var _measurementModule = require('../presentational-components/measurement-module');

var _measurementModule2 = _interopRequireDefault(_measurementModule);

var _scope = require('../scope');

var _scope2 = _interopRequireDefault(_scope);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = function API() {
    return _scope2.default.API;
};

var initialState = {
    "panels": [{
        title: 'PANEL.WORKSPACE',
        icon: 'Toc',
        ModuleClass: _layersModule2.default
    }, {
        title: 'PANEL.LAYERS_CATALOG',
        icon: 'Layers',
        ModuleClass: _catalogModule2.default
    }, {
        title: 'PANEL.INFO_PANEL',
        icon: 'InfoOutline',
        ModuleClass: _infoModule2.default
    }, {
        title: 'PANEL.MEASUREMENT',
        icon: 'Ruler',
        ModuleClass: _measurementModule2.default
    }, {
        title: 'PANEL.MANAGE_WORKSPACES',
        icon: 'FolderSpecial',
        ModuleClass: _manageWorkspacesModule2.default,
        bottom: true
    }],
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

var applyFilters = function applyFilters(state) {
    try {
        var appliedToFilter = state.appliedToFilter,
            allPrompts = state.allPrompts;

        if (_scope2.default.onFilter) {

            console.log(_scope2.default);
            var promptState = {};
            var prompts = [];

            for (var graphicId in appliedToFilter) {
                var promptMap = appliedToFilter[graphicId];
                for (var prompt in promptMap) {
                    promptState[prompt] = promptState[prompt] || {};
                    promptState[prompt][promptMap[prompt]] = true;
                }
            }

            for (var promptName in allPrompts) {
                promptState[promptName] = promptState[promptName] || {};
            }

            for (var _promptName in promptState) {
                var values = Object.keys(promptState[_promptName]).map(function (value) {
                    return value === "undefined" ? '' : value;
                });
                prompts.push({
                    prompt: _promptName,
                    value: values
                });
            }

            _scope2.default.onFilter(prompts);
        }
    } catch (error) {
        console.error(error);
    }
};

var applyZoomRange = function applyZoomRange(zoomChangeState) {
    var currentWorkspace = zoomChangeState.workspaces[zoomChangeState.currentWorkspace];
    var currentZoom = API() ? API().getZoom() : zoomChangeState.zoom;
    for (var layerId in currentWorkspace.layers) {
        var _currentWorkspace$lay = currentWorkspace.layers[layerId],
            minZoom = _currentWorkspace$lay.minZoom,
            maxZoom = _currentWorkspace$lay.maxZoom;

        if (minZoom !== undefined && maxZoom !== undefined) {
            var _layers2, _workspaces;

            zoomChangeState = (0, _immutabilityHelper2.default)(zoomChangeState, {
                workspaces: (_workspaces = {}, _workspaces[zoomChangeState.currentWorkspace] = {
                    layers: (_layers2 = {}, _layers2[layerId] = {
                        insideZoomRange: {
                            $set: currentZoom >= minZoom && currentZoom <= maxZoom
                        }
                    }, _layers2)
                }, _workspaces)
            });
        }
    }
    return zoomChangeState;
};

var mainReducer = function mainReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    var layers = state.layers,
        enrichedSources = state.enrichedSources,
        dataToLayersListeners = state.dataToLayersListeners,
        zoom = state.zoom,
        rulerEnabled = state.rulerEnabled,
        popupFixed = state.popupFixed,
        mouseOverPopup = state.mouseOverPopup,
        hoverShown = state.hoverShown,
        hoverConfig = state.hoverConfig,
        workspaces = state.workspaces,
        currentWorkspace = state.currentWorkspace,
        currentWorkspaceSelection = state.currentWorkspaceSelection,
        mouseOverFeature = state.mouseOverFeature,
        selectedFeatures = state.selectedFeatures,
        partialSelectedFeatures = state.partialSelectedFeatures,
        appliedToFilter = state.appliedToFilter,
        customizeLayer = state.customizeLayer,
        enrichedSourcesResponses = state.enrichedSourcesResponses;


    var payload = action.payload || {};

    var value = payload.value,
        map = payload.map,
        layerId = payload.layerId,
        dataId = payload.dataId,
        newData = payload.newData,
        error = payload.error,
        legendType = payload.legendType,
        legend = payload.legend,
        opacity = payload.opacity,
        itemId = payload.itemId,
        oldIndex = payload.oldIndex,
        newIndex = payload.newIndex,
        insideZoomRange = payload.insideZoomRange,
        increase = payload.increase,
        newZoom = payload.newZoom,
        basemap = payload.basemap,
        authentication = payload.authentication,
        attributes = payload.attributes,
        position = payload.position,
        force = payload.force,
        workspaceSelection = payload.workspaceSelection,
        workspaceId = payload.workspaceId,
        symbolInfo = payload.symbolInfo,
        fields = payload.fields,
        graphicId = payload.graphicId,
        withoutApply = payload.withoutApply,
        type = payload.type,
        customRenderer = payload.customRenderer,
        field = payload.field,
        originalType = payload.originalType,
        enrichedSourceResponse = payload.enrichedSourceResponse,
        enrichedSourceId = payload.enrichedSourceId,
        defaultRenderer = payload.defaultRenderer;


    var _currentWorkspace = workspaces[currentWorkspace] || {};
    var _layers = _currentWorkspace.layers || {};
    var layer = _layers[layerId] || {};
    var layersOrder = _currentWorkspace.layersOrder;
    var partialSelectedFeaturesKeys = Object.keys(partialSelectedFeatures);
    var selectedFeaturesKeys = Object.keys(selectedFeatures);
    var finalSelectedFeatures = Object.assign({}, selectedFeatures, partialSelectedFeatures);
    var nextWorkspace = workspaces[workspaceId];

    var _ret = function () {
        var _metaData, _customizeLayer, _renderer, _layers4, _workspaces3, _customizeLayer2, _workspaces4, _workspaces5, _data, _workspaces6, _layers5, _workspaces7, _workspaces8, _layers6, _workspaces9, _layers7, _items, _layers9, _workspaces10, _layers10, _workspaces11, _renderer2, _layers11, _workspaces12, _layers12, _workspaces13;

        switch (action.type) {
            case 'GENERATE_METADATA':
                var newMetadata = {};
                var features = enrichedSourceResponse.features;

                if (features && features.length) {
                    var missingValues = {};
                    var missingValuesCount = 0;
                    for (var _iterator = features, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                        var _ref;

                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            _i = _iterator.next();
                            if (_i.done) break;
                            _ref = _i.value;
                        }

                        var feature = _ref;
                        var _attributes2 = feature.attributes;

                        for (var key in _attributes2) {
                            var _value = _attributes2[key];
                            if (!_value) {
                                if (missingValues[key] === undefined) {
                                    missingValuesCount++;
                                }
                                missingValues[key] = true;
                            } else {
                                newMetadata[key] = typeof _value === 'undefined' ? 'undefined' : _typeof(_value);
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
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        metaData: (_metaData = {}, _metaData[enrichedSourceId] = {
                            $set: newMetadata
                        }, _metaData)
                    })
                };

            case 'CUSTOMIZE_LEGEND':
                var layerRenderer = JSON.parse(JSON.stringify(layer.renderer));
                var rendererType = layerRenderer[type];
                if (rendererType.dynamicBreaks && !rendererType.custom) {
                    rendererType.custom = API().getBreaks(rendererType.dynamicBreaks, rendererType.field, (0, _objectHash2.default)({ layerId: layerId, enrichedSourceId: layer.enrichedSource }));
                }
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        customizeLayer: (_customizeLayer = {}, _customizeLayer[layerId] = {
                            $set: layerRenderer
                        }, _customizeLayer)
                    })
                };
            case 'APPLY_CUSTOM_RENDERER':
                var applyCustomRendererState = state;
                API().removeLayer(layerId);
                if (originalType !== type) {
                    var _layers3, _workspaces2;

                    applyCustomRendererState = (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces2 = {}, _workspaces2[currentWorkspace] = {
                            layers: (_layers3 = {}, _layers3[layerId] = {
                                renderer: {
                                    $unset: [originalType]
                                }
                            }, _layers3)
                        }, _workspaces2)
                    });
                }
                return {
                    v: (0, _immutabilityHelper2.default)(applyCustomRendererState, {
                        workspaces: (_workspaces3 = {}, _workspaces3[currentWorkspace] = {
                            layers: (_layers4 = {}, _layers4[layerId] = {
                                built: {
                                    $set: false
                                },
                                renderer: (_renderer = {}, _renderer[type] = {
                                    $set: customRenderer
                                }, _renderer.default = defaultRenderer ? { $set: defaultRenderer } : {}, _renderer.$unset = ['multiple'], _renderer)
                            }, _layers4)
                        }, _workspaces3)
                    })
                };
            case 'BOOTSTRAP':
                var bootstrapState = (0, _immutabilityHelper2.default)(state, {
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

                for (var option in map) {
                    var _update;

                    bootstrapState = (0, _immutabilityHelper2.default)(bootstrapState, (_update = {}, _update[option] = {
                        $set: map[option]
                    }, _update));
                }

                if (authentication) {
                    bootstrapState = (0, _immutabilityHelper2.default)(bootstrapState, {
                        authentication: {
                            $set: authentication
                        }
                    });
                }
                if (map.navOpened !== undefined) {
                    bootstrapState = (0, _immutabilityHelper2.default)(bootstrapState, {
                        navOpened: {
                            $set: map.navOpened
                        }
                    });
                }
                return {
                    v: applyZoomRange(bootstrapState)
                };
            case 'RECALCULATE_BREAKS':
                var customizeRenderer = JSON.parse(JSON.stringify(customizeLayer[layerId]));
                if (type !== originalType) {
                    customizeRenderer[type] = customRenderer;
                }
                var currentType = customizeRenderer[type];
                currentType.custom = API().getBreaks(customRenderer.dynamicBreaks, customRenderer.field, (0, _objectHash2.default)({ layerId: layerId, enrichedSourceId: layer.enrichedSource }));
                currentType.dynamicBreaks = customRenderer.dynamicBreaks;
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        customizeLayer: (_customizeLayer2 = {}, _customizeLayer2[layerId] = {
                            $set: customizeRenderer
                        }, _customizeLayer2)
                    })
                };
            case 'CLEAR_PARTIAL_FILTER_SELECTION':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        partialSelectedFeatures: {
                            $unset: partialSelectedFeaturesKeys
                        }
                    })
                };
            case 'CLEAR_APPLIED_FILTER_SELECTIONS':
                if (selectedFeaturesKeys.length === 0) return {
                        v: state
                    };

                for (var _graphicId in selectedFeatures) {
                    API().clearHighlight(_graphicId);
                }

                var clearAppliedFilterState = (0, _immutabilityHelper2.default)(state, {
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
                return {
                    v: clearAppliedFilterState
                };
            case 'APPLY_FILTER_SELECTION':

                var newApplyFilterState = state;
                var updatedAppliedToFilter = {};

                var _loop = function _loop(_graphicId2) {
                    var _selectedFeatures;

                    var promptsApplied = {};
                    API().highlight(_graphicId2);
                    var _layerId = finalSelectedFeatures[_graphicId2];
                    var _attributes = API().getGraphicAttributes(_graphicId2);
                    var _layer = _currentWorkspace.layers[_layerId];
                    var promptConfig = _layer.promptConfig || [];
                    promptConfig.forEach(function (config) {
                        var _allPrompts;

                        var prompt = config.prompt,
                            metric = config.metric;

                        newApplyFilterState = (0, _immutabilityHelper2.default)(newApplyFilterState, {
                            allPrompts: (_allPrompts = {}, _allPrompts[prompt] = {
                                $set: true
                            }, _allPrompts)
                        });
                        promptsApplied[prompt] = _attributes[metric];
                    });
                    newApplyFilterState = (0, _immutabilityHelper2.default)(newApplyFilterState, {
                        selectedFeatures: (_selectedFeatures = {}, _selectedFeatures[_graphicId2] = {
                            $set: _layerId
                        }, _selectedFeatures)
                    });
                    updatedAppliedToFilter[_graphicId2] = promptsApplied;
                };

                for (var _graphicId2 in finalSelectedFeatures) {
                    _loop(_graphicId2);
                }

                for (var _graphicId3 in appliedToFilter) {
                    if (!updatedAppliedToFilter[_graphicId3]) {
                        API().clearHighlight(_graphicId3);
                    }
                }

                newApplyFilterState = (0, _immutabilityHelper2.default)(newApplyFilterState, {
                    appliedToFilter: {
                        $set: updatedAppliedToFilter
                    },
                    partialSelectedFeatures: {
                        $unset: partialSelectedFeaturesKeys
                    }
                });
                applyFilters(newApplyFilterState);
                return {
                    v: newApplyFilterState
                };
            case 'WORKSPACE_SELECTION_CHANGE':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        currentWorkspaceSelection: {
                            $set: workspaceSelection
                        }
                    })
                };
            case 'REMOVE_LAYER_FROM_WORKSPACE':
                API().removeLayer(layerId);
                var removeLayerState = (0, _immutabilityHelper2.default)(state, {
                    workspaces: (_workspaces4 = {}, _workspaces4[currentWorkspace] = {
                        layers: {
                            $unset: [layerId]
                        },
                        layersOrder: {
                            $splice: [[_currentWorkspace.layersOrder.indexOf(layerId), 1]]
                        }
                    }, _workspaces4)
                });
                return {
                    v: removeLayerState
                };
            case 'ADD_LAYER':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        currentModule: {
                            $set: 'PANEL.LAYERS_CATALOG'
                        }
                    })
                };
            case 'WORKSPACE_SELECTION_APPLY':
                var updatedWorkspaceLayers = {};
                var updatedLayersOrder = [];
                currentWorkspaceSelection.forEach(function (_layerId) {
                    if (_currentWorkspace.layers[_layerId]) {
                        updatedWorkspaceLayers[_layerId] = _currentWorkspace.layers[_layerId];
                    } else {
                        updatedWorkspaceLayers[_layerId] = Object.assign({ workspaceId: currentWorkspace }, layers[_layerId]);
                    }
                    updatedLayersOrder.push(_layerId);
                });

                for (var _layerId in _currentWorkspace.layers) {
                    if (!updatedWorkspaceLayers[_layerId]) {
                        API().removeLayer(_layerId);
                    }
                }

                var workspaceSelectionApplyState = (0, _immutabilityHelper2.default)(state, {
                    workspaces: (_workspaces5 = {}, _workspaces5[currentWorkspace] = {
                        layers: {
                            $set: updatedWorkspaceLayers
                        },
                        layersOrder: {
                            $set: updatedLayersOrder
                        }
                    }, _workspaces5),
                    currentModule: {
                        $set: 'PANEL.WORKSPACE'
                    }
                });

                return {
                    v: applyZoomRange(workspaceSelectionApplyState)
                };
            case 'TOGGLE_RULER':
                var nextModule = void 0;
                if (value) {
                    nextModule = 'Measurement';
                } else {
                    nextModule = state.currentModule === 'Measurement' ? 'Map Layers' : state.currentModule;
                }

                var enabledRuler = value !== undefined ? value : !rulerEnabled;
                API().toggleRuler(enabledRuler);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {})
                };

                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        currentModule: {
                            $set: nextModule
                        },
                        rulerEnabled: {
                            $set: enabledRuler
                        }
                    })
                };
            case 'SELECTED_FEATURE_CHANGE':
                if (value) {
                    var _partialSelectedFeatu;

                    return {
                        v: (0, _immutabilityHelper2.default)(state, {
                            partialSelectedFeatures: (_partialSelectedFeatu = {}, _partialSelectedFeatu[graphicId] = {
                                $set: String(layerId)
                            }, _partialSelectedFeatu)
                        })
                    };
                } else {
                    return {
                        v: (0, _immutabilityHelper2.default)(state, {
                            partialSelectedFeatures: {
                                $unset: [graphicId]
                            },
                            selectedFeatures: {
                                $unset: [graphicId]
                            }
                        })
                    };
                }
            case "CHANGE_CURRENT_MODULE":
                var module = payload.module;
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        currentModule: {
                            $set: module
                        },
                        navOpened: {
                            $set: state.currentModule !== module ? true : !state.navOpened
                        }
                    })
                };
            case 'DATA_CHANGE':
                var newStateDataChange = (0, _immutabilityHelper2.default)(state, {
                    data: (_data = {}, _data[dataId] = {
                        $set: newData
                    }, _data)
                });

                var affectedInstances = dataToLayersListeners[dataId] || [];
                var layersUpdate = {};

                affectedInstances.forEach(function (layerId) {

                    if (_layers[layerId]) {
                        API().removeLayer(layerId);
                        layersUpdate[layerId] = {
                            built: {
                                $set: false
                            }
                        };
                    }
                });

                return {
                    v: (0, _immutabilityHelper2.default)(newStateDataChange, {
                        workspaces: (_workspaces6 = {}, _workspaces6[currentWorkspace] = {
                            layers: layersUpdate
                        }, _workspaces6)
                    })
                };
            case 'CHANGE_LAYER_OPACITY':
                API().changeLayerOpacity(layerId, opacity);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces7 = {}, _workspaces7[currentWorkspace] = {
                            layers: (_layers5 = {}, _layers5[layerId] = {
                                opacity: {
                                    $set: opacity
                                }
                            }, _layers5)
                        }, _workspaces7)
                    })
                };
            case 'REORDER_LAYER':
                var newArrayGroup = (0, _reactSortableHoc.arrayMove)(layersOrder, oldIndex, newIndex);
                var newStateReorderLayerGroup = (0, _immutabilityHelper2.default)(state, {
                    workspaces: (_workspaces8 = {}, _workspaces8[currentWorkspace] = {
                        layersOrder: {
                            $set: newArrayGroup
                        }
                    }, _workspaces8)
                });
                API().reorderLayers(newArrayGroup);
                return {
                    v: newStateReorderLayerGroup
                };
            case 'CENTER_LAYER':
                API().centerAtLayer(layerId);
                return {
                    v: state
                };
            case 'TOGGLE_EXPANDED':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces9 = {}, _workspaces9[currentWorkspace] = {
                            layers: (_layers6 = {}, _layers6[layerId] = {
                                expanded: {
                                    $set: !layer.expanded
                                }
                            }, _layers6)
                        }, _workspaces9)
                    })
                };
            case 'TOGGLE_GROUP_EXPANDED':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        layers: (_layers7 = {}, _layers7[layerId] = {
                            expanded: {
                                $set: !layer.expanded
                            }
                        }, _layers7)
                    })
                };
            case "TOGGLE_GROUP":
                var groupEnabled = !items[itemId].enabled;
                var groupLayers = groupsOrder[itemId];
                var toggleGroupState = (0, _immutabilityHelper2.default)(state, {
                    items: (_items = {}, _items[itemId] = {
                        enabled: {
                            $set: groupEnabled
                        }
                    }, _items)
                });
                groupLayers.forEach(function (_layerId) {
                    var _layers8;

                    toggleGroupState = (0, _immutabilityHelper2.default)(toggleGroupState, {
                        layers: (_layers8 = {}, _layers8[_layerId] = {
                            enabled: {
                                $set: groupEnabled
                            }
                        }, _layers8)
                    });
                    API().toggleLayer(layers[_layerId].currentInstance, groupEnabled);
                });
                return {
                    v: toggleGroupState
                };
            case "TOGGLE_LAYER":
                var layerEnabled = !layer.enabled;

                API().toggleLayer(layerId, layerEnabled);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces10 = {}, _workspaces10[currentWorkspace] = {
                            layers: (_layers9 = {}, _layers9[layerId] = {
                                enabled: {
                                    $set: layerEnabled
                                }
                            }, _layers9)
                        }, _workspaces10)
                    })
                };
            case 'BUILD_LAYER':
                API().buildLayer(layer, enrichedSources[layer.enrichedSource]);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces11 = {}, _workspaces11[currentWorkspace] = {
                            layers: (_layers10 = {}, _layers10[layerId] = {
                                building: {
                                    $set: true
                                }
                            }, _layers10)
                        }, _workspaces11)
                    })
                };
            case 'LEGEND_CREATED':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces12 = {}, _workspaces12[currentWorkspace] = {
                            layers: (_layers11 = {}, _layers11[layerId] = {
                                renderer: (_renderer2 = {}, _renderer2[legendType] = {
                                    $set: legend
                                }, _renderer2)
                            }, _layers11)
                        }, _workspaces12)
                    })
                };
            case 'SHOW_LAYER':
                API().toggleLayer(layerId, insideZoomRange);
                return {
                    v: state
                };
            case 'MAP_ZOOM_CHANGE':
                var mapZoomChangeState = applyZoomRange(state);
                return {
                    v: (0, _immutabilityHelper2.default)(mapZoomChangeState, {
                        zoom: {
                            $set: API().getZoom()
                        }
                    })
                };
            case 'LAYER_BUILT':
                API().reorderLayers(_currentWorkspace.layersOrder);
                if (error) console.error(error);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        workspaces: (_workspaces13 = {}, _workspaces13[currentWorkspace] = {
                            layers: (_layers12 = {}, _layers12[layerId] = {
                                built: {
                                    $set: true
                                },
                                building: {
                                    $set: false
                                },
                                error: {
                                    $set: error
                                }
                            }, _layers12)
                        }, _workspaces13)
                    })
                };
            case 'UPDATE_POPUP_POSITION':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        popupPosition: {
                            $set: position
                        }
                    })
                };
            case 'POPUP_CLOSE':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        popupShown: {
                            $set: force ? false : mouseOverPopup || popupFixed
                        },
                        popupFixed: {
                            $set: force !== undefined ? false : popupFixed
                        }
                    })
                };
            case 'CHANGE_WORKSPACE':
                var workspaceChangeState = state;
                var newWorkspaceSelection = [];

                for (var _layerId2 in nextWorkspace.layers) {
                    newWorkspaceSelection.push(Number(_layerId2));
                }

                if (workspaceId !== currentWorkspace) {
                    for (var _layerId3 in _currentWorkspace.layers) {
                        var _layers13, _workspaces14;

                        API().removeLayer(_layerId3);
                        workspaceChangeState = (0, _immutabilityHelper2.default)(workspaceChangeState, {
                            workspaces: (_workspaces14 = {}, _workspaces14[currentWorkspace] = {
                                layers: (_layers13 = {}, _layers13[_layerId3] = {
                                    built: {
                                        $set: false
                                    },
                                    building: {
                                        $set: false
                                    }
                                }, _layers13)
                            }, _workspaces14),
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

                return {
                    v: (0, _immutabilityHelper2.default)(workspaceChangeState, {
                        currentWorkspace: {
                            $set: workspaceId
                        }
                    })
                };
            case 'MOUSE_OVER_POPUP':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        mouseOverPopup: {
                            $set: value
                        },
                        hoverShown: {
                            $set: mouseOverFeature || value
                        }
                    })
                };
            case 'MOUSE_OUT_OF_FEATURE':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        mouseOverFeature: {
                            $set: false
                        },
                        hoverShown: {
                            $set: mouseOverPopup
                        }
                    })
                };
            case 'FEATURE_HOVER':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
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
                    })
                };
            case 'FEATURE_CLICK':
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        featureInfo: {
                            $set: {
                                attributes: attributes,
                                renderer: layer.renderer,
                                symbolInfo: symbolInfo,
                                infoPanel: layer.infoPanel,
                                fields: fields
                            }
                        },
                        currentModule: {
                            $set: 'PANEL.INFO_PANEL'
                        }
                    })
                };
            case 'CHANGE_BASEMAP':
                if (state.basemap === basemap) return {
                        v: state
                    };
                API().changeBasemap(basemap);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        basemap: {
                            $set: basemap
                        }
                    })
                };
            case "ZOOM_CHANGE":
                var evaluatedZoom = void 0;
                if (newZoom) {
                    evaluatedZoom = newZoom;
                } else {
                    evaluatedZoom = increase ? zoom + 1 : zoom - 1;
                }

                API().changeZoom(evaluatedZoom);
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        zoom: {
                            $set: evaluatedZoom
                        }
                        // popupShown: {
                        //     $set: false
                        // }
                    })
                };
            case "MAP_LOADED":
                return {
                    v: (0, _immutabilityHelper2.default)(state, {
                        mapLoaded: {
                            $set: true
                        }
                    })
                };
            default:
                return {
                    v: state
                };
        }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
};

exports.default = mainReducer;
module.exports = exports['default'];