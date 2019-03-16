import { connect } from 'react-redux';
import App from '../presentational-components/app'
import Actions from '../actions';

const mapStateToProps = (state) => {
    return {
        navOpened: state.navOpened,
        mapLoaded: state.mapLoaded
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onMapLoaded: () => {
            dispatch(Actions.mapActions.mapLoaded())
        },
        bootstrap: (payload) => {
            dispatch(Actions.appActions.bootstrap(payload));
        },
        onDataChange: (payload) => {
            dispatch(Actions.appActions.onDataChange(payload))
        }
    }
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer;
