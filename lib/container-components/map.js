'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _map = require('../presentational-components/map');

var _map2 = _interopRequireDefault(_map);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var zoom = state.zoom,
        center = state.center,
        rulerEnabled = state.rulerEnabled,
        basemap = state.basemap,
        authentication = state.authentication;


    return {
        zoom: zoom,
        center: center,
        rulerEnabled: rulerEnabled,
        basemap: basemap,
        authentication: authentication
    };
};

var mapDispatchToProps = function mapDispatchToProps(_dispatch) {
    return {
        dispatch: function dispatch(action) {
            return _dispatch(action);
        },
        zoomChange: function zoomChange(increase) {
            _dispatch(_actions2.default.mapActions.zoomChange(increase));
        },
        toggleRuler: function toggleRuler(value) {
            _dispatch(_actions2.default.mapActions.toggleRuler(value));
        },
        toggleSingleFilter: function toggleSingleFilter() {
            _dispatch(_actions2.default.mapActions.toggleSingleFilter());
        },
        toggleAreaFilter: function toggleAreaFilter() {
            _dispatch(_actions2.default.mapActions.toggleAreaFilter());
        },
        changeBasemap: function changeBasemap(basemap) {
            _dispatch(_actions2.default.mapActions.changeBasemap(basemap));
        }
    };
};

var MapContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_map2.default);

exports.default = MapContainer;
module.exports = exports['default'];