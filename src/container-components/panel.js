import { connect } from 'react-redux';
import Panel from '../presentational-components/panel';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {currentModule, panels, rulerEnabled, filters, featureInfo} = state;
    return {
        currentModule,
        panels,
        rulerEnabled,
        filters,
        featureInfo
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onModuleChange: (module) => {
            dispatch(Actions.appActions.changeCurrentModule(module))
        }
    }
};

const PanelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Panel);

export default PanelContainer;
