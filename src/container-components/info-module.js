import { connect } from 'react-redux';
import InfoModule from '../presentational-components/info-module';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {featureInfo} = state;
    const {
        attributes,
        renderer,
        symbolInfo,
        infoPanel,
        fields
    } = featureInfo;
    return {
        attributes,
        renderer,
        symbolInfo,
        infoPanel,
        fields
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

const InfoModuleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoModule);

export default InfoModuleContainer;
