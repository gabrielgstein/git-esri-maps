'use strict';

exports.__esModule = true;
var mapActions = {

    mapLoaded: function mapLoaded() {
        return {
            type: 'MAP_LOADED'
        };
    },

    zoomChange: function zoomChange(increase, newZoom) {
        return {
            type: 'ZOOM_CHANGE',
            payload: {
                increase: increase,
                newZoom: newZoom
            }
        };
    },

    removeFilter: function removeFilter(filterIndex) {
        return {
            type: 'REMOVE_FILTER',
            payload: {
                filterIndex: filterIndex
            }
        };
    },

    toggleRuler: function toggleRuler(value) {
        return {
            type: 'TOGGLE_RULER',
            payload: {
                value: value
            }
        };
    },

    toggleSingleFilter: function toggleSingleFilter() {
        return {
            type: 'TOGGLE_SINGLE_FILTER'
        };
    },

    toggleAreaFilter: function toggleAreaFilter() {
        return {
            type: 'TOGGLE_AREA_FILTER'
        };
    },

    setAreaFilter: function setAreaFilter(selectedFeatures) {
        return {
            type: 'SET_AREA_FILTER',
            payload: {
                selectedFeatures: selectedFeatures
            }
        };
    },

    changeBasemap: function changeBasemap(basemap) {
        return {
            type: 'CHANGE_BASEMAP',
            payload: {
                basemap: basemap
            }
        };
    },

    featureClick: function featureClick(attributes, fields, layerId, symbolInfo) {
        return {
            type: 'FEATURE_CLICK',
            payload: {
                attributes: attributes,
                layerId: layerId,
                symbolInfo: symbolInfo,
                fields: fields
            }
        };
    },

    featureHover: function featureHover(graphicId, layerId, attributes, position) {
        return {
            type: 'FEATURE_HOVER',
            payload: {
                graphicId: graphicId,
                layerId: layerId,
                attributes: attributes,
                position: position
            }
        };
    },

    onSelectFeatureChange: function onSelectFeatureChange(value, layerId, graphicId) {
        return {
            type: 'SELECTED_FEATURE_CHANGE',
            payload: {
                value: value,
                graphicId: graphicId,
                layerId: layerId
            }
        };
    },

    onApplyGraphicAsFilter: function onApplyGraphicAsFilter(layerId, graphicId) {
        return {
            type: 'APPLY_GRAPHIC_AS_FILTER',
            payload: {
                graphicId: graphicId,
                layerId: layerId
            }
        };
    },

    mouseOutOfFeature: function mouseOutOfFeature() {
        return {
            type: 'MOUSE_OUT_OF_FEATURE'
        };
    },

    mouseOverPopup: function mouseOverPopup(value) {
        return {
            type: 'MOUSE_OVER_POPUP',
            payload: {
                value: value
            }
        };
    },

    updatePopupPosition: function updatePopupPosition(position) {
        return {
            type: 'UPDATE_POPUP_POSITION',
            payload: {
                position: position
            }
        };
    },

    closePopup: function closePopup(force) {
        return {
            type: 'POPUP_CLOSE',
            payload: {
                force: force
            }
        };
    },

    mapClick: function mapClick() {
        return {
            type: 'MAP_CLICK',
            payload: {}
        };
    },

    mapExtentChange: function mapExtentChange() {
        return {
            type: 'MAP_EXTENT_CHANGE',
            payload: {}
        };
    },

    mapZoomChange: function mapZoomChange() {
        return {
            type: 'MAP_ZOOM_CHANGE',
            payload: {}
        };
    },

    panStarted: function panStarted() {
        return {
            type: 'PAN_STARTED',
            payload: {}
        };
    },

    mapResized: function mapResized() {
        return {
            type: 'MAP_RESIZED',
            payload: {}
        };
    }

};

exports.default = mapActions;
module.exports = exports['default'];