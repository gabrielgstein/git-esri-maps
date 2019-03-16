"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NormalizationHelper = function () {
    function NormalizationHelper() {
        _classCallCheck(this, NormalizationHelper);
    }

    NormalizationHelper.configNormalizer = function configNormalizer(config) {
        var layers = config.layers || {};
        var enrichedSources = config.enrichedSources || {};
        var workspaces = config.workspaces || {};
        var currentWorkspace = config.currentWorkspace || 0;
        var dataToLayersListeners = {};
        var map = config.map || {};
        for (var layerId in layers) {
            var enrichedSourceId = layers[layerId].enrichedSource;
            dataToLayersListeners[enrichedSourceId] = dataToLayersListeners[enrichedSourceId] || [];
            dataToLayersListeners[enrichedSourceId].push(layerId);
        }
        var currentWorkspaceSelection = Object.keys(workspaces[currentWorkspace].layers).map(function (workspace) {
            return Number(workspace);
        });

        return {
            layers: layers,
            enrichedSources: enrichedSources,
            workspaces: workspaces,
            map: map,
            currentWorkspaceSelection: currentWorkspaceSelection,
            dataToLayersListeners: dataToLayersListeners,
            currentWorkspace: currentWorkspace
        };
    };

    return NormalizationHelper;
}();

exports.default = NormalizationHelper;
module.exports = exports["default"];