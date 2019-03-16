'use strict';

exports.__esModule = true;
var appActions = {

    changeCurrentModule: function changeCurrentModule(newModule) {
        return {
            type: 'CHANGE_CURRENT_MODULE',
            payload: {
                module: newModule
            }
        };
    },

    onDataChange: function onDataChange(payload) {
        return {
            type: 'DATA_CHANGE',
            payload: {
                dataId: payload.id,
                newData: payload.data
            }
        };
    },

    generateMetaData: function generateMetaData(_ref) {
        var enrichedSourceResponse = _ref.enrichedSourceResponse,
            enrichedSourceId = _ref.enrichedSourceId;

        return {
            type: 'GENERATE_METADATA',
            payload: {
                enrichedSourceResponse: enrichedSourceResponse,
                enrichedSourceId: enrichedSourceId
            }
        };
    },

    onAppContainerScroll: function onAppContainerScroll() {
        return {
            type: 'APP_CONTAINER_SCROLL'
        };
    },

    onWorkspaceSelection: function onWorkspaceSelection(workspaceSelection) {
        return {
            type: 'WORKSPACE_SELECTION_CHANGE',
            payload: {
                workspaceSelection: workspaceSelection
            }
        };
    },

    removeFromWorkspace: function removeFromWorkspace(layerId) {
        return {
            type: 'REMOVE_LAYER_FROM_WORKSPACE',
            payload: {
                layerId: layerId
            }
        };
    },

    onApplyFilterSelection: function onApplyFilterSelection() {
        return {
            type: 'APPLY_FILTER_SELECTION'
        };
    },

    onClearPartialSelections: function onClearPartialSelections() {
        return {
            type: 'CLEAR_PARTIAL_FILTER_SELECTION'
        };
    },

    onClearAppliedSelections: function onClearAppliedSelections(withoutApply) {
        return {
            type: 'CLEAR_APPLIED_FILTER_SELECTIONS',
            payload: {
                withoutApply: withoutApply
            }
        };
    },

    changeWorkspace: function changeWorkspace(workspaceId) {
        return {
            type: 'CHANGE_WORKSPACE',
            payload: {
                workspaceId: workspaceId
            }
        };
    },

    onApplyWorkspaceSelections: function onApplyWorkspaceSelections() {
        return {
            type: 'WORKSPACE_SELECTION_APPLY'
        };
    },

    bootstrap: function bootstrap(payload) {
        return {
            type: 'BOOTSTRAP',
            payload: {
                layers: payload.layers,
                enrichedSources: payload.enrichedSources,
                data: payload.data,
                map: payload.map,
                authentication: payload.authentication,
                currentWorkspaceSelection: payload.currentWorkspaceSelection,
                workspaces: payload.workspaces,
                dataToLayersListeners: payload.dataToLayersListeners,
                currentWorkspace: payload.currentWorkspace
            }
        };
    }

};

exports.default = appActions;
module.exports = exports['default'];