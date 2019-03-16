export const CHANGE_ZOOM = (zoom) => {
    return {
        type: "CHANGE_ZOOM",
        payload: zoom
    }
};

export const CENTER_AT_LAYER = (layer) => {
    return {
        type: "CENTER_AT_LAYER",
        payload: layer
    }
};