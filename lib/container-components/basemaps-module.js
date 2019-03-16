'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _basemapsModule = require('../presentational-components/basemaps-module');

var _basemapsModule2 = _interopRequireDefault(_basemapsModule);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    return {
        basemapsList: state.basemapsList,
        basemap: state.basemap,
        imagesPath: state.imagesPath
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        changeBasemap: function changeBasemap(basemap) {
            dispatch(_actions2.default.mapActions.changeBasemap(basemap));
        }
    };
};

var BasemapContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_basemapsModule2.default);

exports.default = BasemapContainer;
module.exports = exports['default'];