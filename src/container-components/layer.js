import { connect } from 'react-redux';
import {SortableElement} from 'react-sortable-hoc';
import Layer from '../presentational-components/layer';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {currentWorkspace, workspaces} = state;
    return {
        layers: workspaces[currentWorkspace].layers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSwitchToggle: (id, currentInstance) => {
            dispatch(Actions.layersActions.toggleLayer(id, currentInstance));
        },
        buildLayer: (id) => {
            dispatch(Actions.layersActions.buildLayer(id));
        },
        showLayer: (show, id) => {
            dispatch(Actions.layersActions.showLayer(show, id));
        },
        onToggleExpand: (id) => {
            dispatch(Actions.layersActions.onToggleExpand(id));
        },
        centerAtLayer: (layerInstanceId) => {
            dispatch(Actions.layersActions.centerAtLayer(layerInstanceId));
        },
        changeLayerOpacity: (layerId, opacity) => {
            dispatch(Actions.layersActions.changeLayerOpacity(layerId, opacity));
        },
        onCustomizeLegend: (layerId, type) => {
            dispatch(Actions.layersActions.onCustomizeLegend(layerId, type));
        },
        removeFromWorkspace: (layerId) => {
            dispatch(Actions.appActions.removeFromWorkspace(layerId));
        }
    }
};

const SortableLayer = SortableElement(Layer);

const LayerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SortableLayer);

export default LayerContainer;
