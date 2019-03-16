import { connect } from 'react-redux';
import Map from '../presentational-components/map'
import Actions from '../actions';

const mapStateToProps = (state) => {

    const {
        zoom,
        center,
        rulerEnabled,
        basemap,
        authentication,
    } = state;

    return {
        zoom,
        center,
        rulerEnabled,
        basemap,
        authentication,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => dispatch(action),
        zoomChange: (increase) => {
            dispatch(Actions.mapActions.zoomChange(increase));
        },
        toggleRuler: (value) => {
            dispatch(Actions.mapActions.toggleRuler(value));
        },
        toggleSingleFilter: () => {
            dispatch(Actions.mapActions.toggleSingleFilter());
        },
        toggleAreaFilter: () => {
            dispatch(Actions.mapActions.toggleAreaFilter());
        },
        changeBasemap: (basemap) => {
            dispatch(Actions.mapActions.changeBasemap(basemap))
        }
    }
};

const MapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);

export default MapContainer;
