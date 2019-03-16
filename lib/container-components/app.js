'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _app = require('../presentational-components/app');

var _app2 = _interopRequireDefault(_app);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    return {
        navOpened: state.navOpened,
        mapLoaded: state.mapLoaded
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onMapLoaded: function onMapLoaded() {
            dispatch(_actions2.default.mapActions.mapLoaded());
        },
        bootstrap: function bootstrap(payload) {
            dispatch(_actions2.default.appActions.bootstrap(payload));
        },
        onDataChange: function onDataChange(payload) {
            dispatch(_actions2.default.appActions.onDataChange(payload));
        }
    };
};

var AppContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_app2.default);

exports.default = AppContainer;
module.exports = exports['default'];