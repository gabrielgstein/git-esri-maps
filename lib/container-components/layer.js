'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _reactSortableHoc = require('react-sortable-hoc');

var _layer = require('../presentational-components/layer');

var _layer2 = _interopRequireDefault(_layer);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var currentWorkspace = state.currentWorkspace,
        workspaces = state.workspaces;

    return {
        layers: workspaces[currentWorkspace].layers
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onSwitchToggle: function onSwitchToggle(id, currentInstance) {
            dispatch(_actions2.default.layersActions.toggleLayer(id, currentInstance));
        },
        buildLayer: function buildLayer(id) {
            dispatch(_actions2.default.layersActions.buildLayer(id));
        },
        showLayer: function showLayer(show, id) {
            dispatch(_actions2.default.layersActions.showLayer(show, id));
        },
        onToggleExpand: function onToggleExpand(id) {
            dispatch(_actions2.default.layersActions.onToggleExpand(id));
        },
        centerAtLayer: function centerAtLayer(layerInstanceId) {
            dispatch(_actions2.default.layersActions.centerAtLayer(layerInstanceId));
        },
        changeLayerOpacity: function changeLayerOpacity(layerId, opacity) {
            dispatch(_actions2.default.layersActions.changeLayerOpacity(layerId, opacity));
        },
        onCustomizeLegend: function onCustomizeLegend(layerId, type) {
            dispatch(_actions2.default.layersActions.onCustomizeLegend(layerId, type));
        },
        removeFromWorkspace: function removeFromWorkspace(layerId) {
            dispatch(_actions2.default.appActions.removeFromWorkspace(layerId));
        }
    };
};

var SortableLayer = (0, _reactSortableHoc.SortableElement)(_layer2.default);

var LayerContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SortableLayer);

exports.default = LayerContainer;
module.exports = exports['default'];