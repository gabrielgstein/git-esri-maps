'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _panel = require('../presentational-components/panel');

var _panel2 = _interopRequireDefault(_panel);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var currentModule = state.currentModule,
        panels = state.panels,
        rulerEnabled = state.rulerEnabled,
        filters = state.filters,
        featureInfo = state.featureInfo;

    return {
        currentModule: currentModule,
        panels: panels,
        rulerEnabled: rulerEnabled,
        filters: filters,
        featureInfo: featureInfo
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onModuleChange: function onModuleChange(module) {
            dispatch(_actions2.default.appActions.changeCurrentModule(module));
        }
    };
};

var PanelContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_panel2.default);

exports.default = PanelContainer;
module.exports = exports['default'];