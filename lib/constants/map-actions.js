"use strict";

exports.__esModule = true;
var CHANGE_ZOOM = exports.CHANGE_ZOOM = function CHANGE_ZOOM(zoom) {
    return {
        type: "CHANGE_ZOOM",
        payload: zoom
    };
};

var CENTER_AT_LAYER = exports.CENTER_AT_LAYER = function CENTER_AT_LAYER(layer) {
    return {
        type: "CENTER_AT_LAYER",
        payload: layer
    };
};