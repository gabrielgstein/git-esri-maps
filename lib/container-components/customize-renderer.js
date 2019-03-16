'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _customizeRenderer = require('../presentational-components/customize-renderer');

var _customizeRenderer2 = _interopRequireDefault(_customizeRenderer);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var customizeLayer = state.customizeLayer,
        metaData = state.metaData,
        currentWorkspace = state.currentWorkspace,
        workspaces = state.workspaces;
    var layers = workspaces[currentWorkspace].layers;


    return {
        customizeLayer: customizeLayer,
        metaData: metaData,
        layers: layers
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        applyCustomRenderer: function applyCustomRenderer(_ref) {
            var layerId = _ref.layerId,
                type = _ref.type,
                originalType = _ref.originalType,
                customRenderer = _ref.customRenderer,
                defaultRenderer = _ref.defaultRenderer;

            dispatch(_actions2.default.layersActions.applyCustomRenderer({ layerId: layerId, type: type, originalType: originalType, customRenderer: customRenderer, defaultRenderer: defaultRenderer }));
        },
        onRecalculateBreaks: function onRecalculateBreaks(_ref2) {
            var layerId = _ref2.layerId,
                type = _ref2.type,
                originalType = _ref2.originalType,
                customRenderer = _ref2.customRenderer;

            dispatch(_actions2.default.layersActions.onRecalculateBreaks({ layerId: layerId, type: type, originalType: originalType, customRenderer: customRenderer }));
        }
    };
};

var CustomizeRendererContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_customizeRenderer2.default);

exports.default = CustomizeRendererContainer;
module.exports = exports['default'];