'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _layersModule = require('../presentational-components/layers-module');

var _layersModule2 = _interopRequireDefault(_layersModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var currentWorkspace = state.currentWorkspace,
        workspaces = state.workspaces;

    return {
        workspace: workspaces[currentWorkspace],
        mapLoaded: state.mapLoaded,
        layers: workspaces[currentWorkspace].layers
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onReorderLayer: function onReorderLayer(_ref) {
            var oldIndex = _ref.oldIndex,
                newIndex = _ref.newIndex;

            dispatch(_actions2.default.layersActions.onReorderLayer(oldIndex, newIndex));
        },
        onAddLayer: function onAddLayer() {
            dispatch(_actions2.default.layersActions.onAddLayer());
        }
    };
};

var LayersModuleContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_layersModule2.default);

exports.default = LayersModuleContainer;
module.exports = exports['default'];