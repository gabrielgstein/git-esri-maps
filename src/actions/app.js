const appActions = {

    changeCurrentModule: (newModule) => {
        return {
            type: 'CHANGE_CURRENT_MODULE',
            payload: {
                module: newModule
            }
        }
    },

    onDataChange: (payload) => {
        return {
            type: 'DATA_CHANGE',
            payload: {
                dataId: payload.id,
                newData: payload.data
            }
        }
    },

    generateMetaData: ({enrichedSourceResponse, enrichedSourceId}) => {
        return {
            type: 'GENERATE_METADATA',
            payload: {
                enrichedSourceResponse,
                enrichedSourceId
            }
        }
    },

    onAppContainerScroll: () => {
        return {
            type: 'APP_CONTAINER_SCROLL',
        }
    },

    onWorkspaceSelection: (workspaceSelection) => {
        return {
            type: 'WORKSPACE_SELECTION_CHANGE',
            payload: {
                workspaceSelection
            }
        }
    },

    removeFromWorkspace: (layerId) => {
        return {
            type: 'REMOVE_LAYER_FROM_WORKSPACE',
            payload: {
                layerId
            }
        }
    },

    onApplyFilterSelection: () => {
        return {
            type: 'APPLY_FILTER_SELECTION'
        }
    },

    onClearPartialSelections: () => {
        return {
            type: 'CLEAR_PARTIAL_FILTER_SELECTION'
        }
    },

    onClearAppliedSelections: (withoutApply) => {
        return {
            type: 'CLEAR_APPLIED_FILTER_SELECTIONS',
            payload: {
                withoutApply
            }
        }
    },

    changeWorkspace: (workspaceId) => {
        return {
            type: 'CHANGE_WORKSPACE',
            payload: {
                workspaceId
            }
        }
    },

    onApplyWorkspaceSelections: () => {
        return {
            type: 'WORKSPACE_SELECTION_APPLY'
        }
    },

    bootstrap: (payload) => {
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
        }
    }

};

export default appActions;