import { connect } from 'react-redux';
import Actions from '../actions';
import LayersModule from '../presentational-components/layers-module';

const mapStateToProps = (state) => {
    const {currentWorkspace, workspaces, } = state;
    return {
        workspace: workspaces[currentWorkspace],
        mapLoaded: state.mapLoaded,
        layers: workspaces[currentWorkspace].layers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onReorderLayer: ({oldIndex, newIndex}) => {
            dispatch(Actions.layersActions.onReorderLayer(oldIndex, newIndex));
        },
        onAddLayer: () => {
            dispatch(Actions.layersActions.onAddLayer());
        }
    }
};

const LayersModuleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LayersModule);

export default LayersModuleContainer;