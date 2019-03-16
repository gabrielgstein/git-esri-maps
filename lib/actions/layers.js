'use strict';

exports.__esModule = true;
var appActions = {

    toggleLayer: function toggleLayer(layerId) {
        return {
            type: 'TOGGLE_LAYER',
            payload: {
                layerId: layerId
            }
        };
    },

    buildLayer: function buildLayer(layerId) {
        return {
            type: 'BUILD_LAYER',
            payload: {
                layerId: layerId
            }
        };
    },

    showLayer: function showLayer(insideZoomRange, layerId) {
        return {
            type: 'SHOW_LAYER',
            payload: {
                insideZoomRange: insideZoomRange,
                layerId: layerId
            }
        };
    },

    applyCustomRenderer: function applyCustomRenderer(_ref) {
        var layerId = _ref.layerId,
            type = _ref.type,
            originalType = _ref.originalType,
            customRenderer = _ref.customRenderer,
            defaultRenderer = _ref.defaultRenderer;

        return {
            type: 'APPLY_CUSTOM_RENDERER',
            payload: {
                layerId: layerId,
                type: type,
                originalType: originalType,
                customRenderer: customRenderer,
                defaultRenderer: defaultRenderer
            }
        };
    },

    onRecalculateBreaks: function onRecalculateBreaks(_ref2) {
        var layerId = _ref2.layerId,
            type = _ref2.type,
            originalType = _ref2.originalType,
            customRenderer = _ref2.customRenderer;

        return {
            type: 'RECALCULATE_BREAKS',
            payload: {
                layerId: layerId,
                type: type,
                originalType: originalType,
                customRenderer: customRenderer
            }
        };
    },

    onCustomizeLegend: function onCustomizeLegend(layerId, type) {
        return {
            type: 'CUSTOMIZE_LEGEND',
            payload: {
                layerId: layerId,
                type: type
            }
        };
    },

    layerBuilt: function layerBuilt(layerId, error) {
        return {
            type: 'LAYER_BUILT',
            payload: {
                layerId: layerId,
                error: error
            }
        };
    },

    legendCreated: function legendCreated(legendType, layerId, legend) {
        return {
            type: 'LEGEND_CREATED',
            payload: {
                legendType: legendType,
                layerId: layerId,
                legend: legend
            }
        };
    },

    onToggleExpand: function onToggleExpand(layerId) {
        return {
            type: 'TOGGLE_EXPANDED',
            payload: {
                layerId: layerId
            }
        };
    },

    onAddLayer: function onAddLayer() {
        return {
            type: 'ADD_LAYER'
        };
    },

    centerAtLayer: function centerAtLayer(layerId) {
        return {
            type: 'CENTER_LAYER',
            payload: {
                layerId: layerId
            }
        };
    },

    onReorderLayer: function onReorderLayer(oldIndex, newIndex) {
        return {
            type: 'REORDER_LAYER',
            payload: {
                oldIndex: oldIndex,
                newIndex: newIndex
            }
        };
    },

    onReorderGroupLayer: function onReorderGroupLayer(oldIndex, newIndex, itemId) {
        return {
            type: 'REORDER_GROUP_LAYER',
            payload: {
                oldIndex: oldIndex,
                newIndex: newIndex,
                itemId: itemId
            }
        };
    },

    changeLayerOpacity: function changeLayerOpacity(layerId, opacity) {
        return {
            type: 'CHANGE_LAYER_OPACITY',
            payload: {
                layerId: layerId,
                opacity: opacity
            }
        };
    }

};

exports.default = appActions;
module.exports = exports['default'];