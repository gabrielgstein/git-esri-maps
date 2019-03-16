import { connect } from 'react-redux';
import BasemapsModule from '../presentational-components/basemaps-module';
import Actions from '../actions';

const mapStateToProps = (state) => {
    return {
        basemapsList: state.basemapsList,
        basemap: state.basemap,
        imagesPath: state.imagesPath
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeBasemap: (basemap) => {
            dispatch(Actions.mapActions.changeBasemap(basemap));
        }
    }
};

const BasemapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BasemapsModule);

export default BasemapContainer;
