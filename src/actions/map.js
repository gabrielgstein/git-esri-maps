const mapActions = {

    mapLoaded: () => {
        return {
            type: 'MAP_LOADED'
        }
    },

    zoomChange: (increase, newZoom) => {
        return {
            type: 'ZOOM_CHANGE',
            payload: {
                increase,
                newZoom
            }
        }
    },

    removeFilter: (filterIndex) => {
        return {
            type: 'REMOVE_FILTER',
            payload: {
                filterIndex
            }
        }
    },

    toggleRuler: (value) => {
        return {
            type: 'TOGGLE_RULER',
            payload: {
                value
            }
        }
    },

    toggleSingleFilter: () => {
        return {
            type: 'TOGGLE_SINGLE_FILTER'
        }
    },

    toggleAreaFilter: () => {
        return {
            type: 'TOGGLE_AREA_FILTER'
        }
    },

    setAreaFilter: (selectedFeatures) => {
        return {
            type: 'SET_AREA_FILTER',
            payload: {
                selectedFeatures
            }
        }
    },

    changeBasemap: (basemap) => {
        return {
            type: 'CHANGE_BASEMAP',
            payload: {
                basemap
            }
        }
    },

    featureClick: (attributes, fields, layerId, symbolInfo,) => {
        return {
            type: 'FEATURE_CLICK',
            payload: {
                attributes,
                layerId,
                symbolInfo,
                fields
            }
        }
    },

    featureHover: (graphicId, layerId, attributes, position) => {
        return {
            type: 'FEATURE_HOVER',
            payload: {
                graphicId,
                layerId,
                attributes,
                position
            }
        }
    },

    onSelectFeatureChange: (value, layerId, graphicId) => {
        return {
            type: 'SELECTED_FEATURE_CHANGE',
            payload: {
                value,
                graphicId,
                layerId
            }
        }
    },

    onApplyGraphicAsFilter: (layerId, graphicId) => {
        return {
            type: 'APPLY_GRAPHIC_AS_FILTER',
            payload: {
                graphicId,
                layerId
            }
        }
    },

    mouseOutOfFeature: () => {
        return {
            type: 'MOUSE_OUT_OF_FEATURE'
        }
    },

    mouseOverPopup: (value) => {
        return {
            type: 'MOUSE_OVER_POPUP',
            payload: {
                value
            }
        }
    },

    updatePopupPosition: (position) => {
        return {
            type: 'UPDATE_POPUP_POSITION',
            payload: {
                position
            }
        }
    },


    closePopup: (force) => {
        return {
            type: 'POPUP_CLOSE',
            payload: {
                force
            }
        }
    },

    mapClick: () => {
        return {
            type: 'MAP_CLICK',
            payload: {

            }
        }
    },

    mapExtentChange: () => {
        return {
            type: 'MAP_EXTENT_CHANGE',
            payload: {

            }
        }
    },

    mapZoomChange: () => {
        return {
            type: 'MAP_ZOOM_CHANGE',
            payload: {

            }
        }
    },

    panStarted: () => {
        return {
            type: 'PAN_STARTED',
            payload: {

            }
        }
    },

    mapResized: () => {
        return {
            type: 'MAP_RESIZED',
            payload: {

            }
        }
    }

};

export default mapActions;

