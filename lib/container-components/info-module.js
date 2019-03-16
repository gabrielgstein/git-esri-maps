'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _infoModule = require('../presentational-components/info-module');

var _infoModule2 = _interopRequireDefault(_infoModule);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var featureInfo = state.featureInfo;
    var attributes = featureInfo.attributes,
        renderer = featureInfo.renderer,
        symbolInfo = featureInfo.symbolInfo,
        infoPanel = featureInfo.infoPanel,
        fields = featureInfo.fields;

    return {
        attributes: attributes,
        renderer: renderer,
        symbolInfo: symbolInfo,
        infoPanel: infoPanel,
        fields: fields
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {};
};

var InfoModuleContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_infoModule2.default);

exports.default = InfoModuleContainer;
module.exports = exports['default'];