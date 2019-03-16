import { connect } from 'react-redux';
import CustomizeRenderer from '../presentational-components/customize-renderer'
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {
        customizeLayer,
        metaData,
        currentWorkspace,
        workspaces,
    } = state;

    const { layers } = workspaces[currentWorkspace];


    return {
        customizeLayer,
        metaData,
        layers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        applyCustomRenderer: ({layerId, type, originalType, customRenderer, defaultRenderer}) => {
            dispatch(Actions.layersActions.applyCustomRenderer({layerId, type, originalType, customRenderer, defaultRenderer}));
        },
        onRecalculateBreaks: ({layerId, type, originalType, customRenderer}) => {
            dispatch(Actions.layersActions.onRecalculateBreaks({layerId, type, originalType, customRenderer}));
        }
    }
};

const CustomizeRendererContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomizeRenderer);

export default CustomizeRendererContainer;
