export default class NormalizationHelper {

    static configNormalizer(config) {
        const layers = config.layers || {};
        const enrichedSources = config.enrichedSources || {};
        const workspaces = config.workspaces || {};
        const currentWorkspace = config.currentWorkspace || 0;
        const dataToLayersListeners = {};
        const map = config.map || {};
        for (let layerId in layers) {
            const enrichedSourceId = layers[layerId].enrichedSource;
            dataToLayersListeners[enrichedSourceId] = dataToLayersListeners[enrichedSourceId] || [];
            dataToLayersListeners[enrichedSourceId].push(layerId);
        }
        const currentWorkspaceSelection = Object.keys(workspaces[currentWorkspace].layers).map(workspace => Number(workspace));

        return {
            layers,
            enrichedSources,
            workspaces,
            map,
            currentWorkspaceSelection,
            dataToLayersListeners,
            currentWorkspace
        };
    }

}
