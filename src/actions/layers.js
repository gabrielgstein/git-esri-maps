const appActions = {

    toggleLayer: (layerId) => {
        return {
            type: 'TOGGLE_LAYER',
            payload: {
                layerId
            }
        }
    },

    buildLayer: (layerId) => {
        return {
            type: 'BUILD_LAYER',
            payload: {
                layerId
            }
        }
    },

    showLayer: (insideZoomRange, layerId) => {
        return {
            type: 'SHOW_LAYER',
            payload: {
                insideZoomRange,
                layerId
            }
        }
    },

    applyCustomRenderer: ({layerId, type, originalType, customRenderer, defaultRenderer}) => {
        return {
            type: 'APPLY_CUSTOM_RENDERER',
            payload: {
                layerId,
                type,
                originalType,
                customRenderer,
                defaultRenderer
            }
        }
    },

    onRecalculateBreaks: ({layerId, type, originalType, customRenderer}) => {
        return {
            type: 'RECALCULATE_BREAKS',
            payload: {
                layerId,
                type,
                originalType,
                customRenderer
            }
        }
    },

    onCustomizeLegend: (layerId, type) => {
        return {
            type: 'CUSTOMIZE_LEGEND',
            payload: {
                layerId,
                type
            }
        }
    },

    layerBuilt: (layerId, error) => {
        return {
            type: 'LAYER_BUILT',
            payload: {
                layerId,
                error
            }
        }
    },

    legendCreated: (legendType, layerId, legend) => {
        return {
            type: 'LEGEND_CREATED',
            payload: {
                legendType,
                layerId,
                legend
            }
        }
    },

    onToggleExpand: (layerId) => {
        return {
            type: 'TOGGLE_EXPANDED',
            payload: {
                layerId
            }
        }
    },

    onAddLayer: () => {
        return {
            type: 'ADD_LAYER',
        }
    },


    centerAtLayer: (layerId) => {
        return {
            type: 'CENTER_LAYER',
            payload: {
                layerId
            }
        }
    },

    onReorderLayer: (oldIndex, newIndex) => {
        return {
            type: 'REORDER_LAYER',
            payload: {
                oldIndex,
                newIndex
            }
        }
    },

    onReorderGroupLayer: (oldIndex, newIndex, itemId) => {
        return {
            type: 'REORDER_GROUP_LAYER',
            payload: {
                oldIndex,
                newIndex,
                itemId
            }
        }
    },

    changeLayerOpacity: (layerId, opacity) => {
        return {
            type: 'CHANGE_LAYER_OPACITY',
            payload: {
                layerId,
                opacity
            }
        }
    }

};

export default appActions;