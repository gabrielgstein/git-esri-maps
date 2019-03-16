'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _catalogModule = require('../presentational-components/catalog-module');

var _catalogModule2 = _interopRequireDefault(_catalogModule);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var layers = state.layers,
        enrichedSources = state.enrichedSources,
        workspaces = state.workspaces,
        currentWorkspace = state.currentWorkspace,
        currentWorkspaceSelection = state.currentWorkspaceSelection;

    return {
        layers: layers,
        enrichedSources: enrichedSources,
        workspace: workspaces[currentWorkspace],
        currentWorkspaceSelection: currentWorkspaceSelection
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onWorkspaceSelectionChange: function onWorkspaceSelectionChange(workspaceSelection) {
            dispatch(_actions2.default.appActions.onWorkspaceSelection(workspaceSelection));
        },
        onApplyWorkspaceSelections: function onApplyWorkspaceSelections() {
            dispatch(_actions2.default.appActions.onApplyWorkspaceSelections());
        }
    };
};

var CatalogModuleContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_catalogModule2.default);

exports.default = CatalogModuleContainer;
module.exports = exports['default'];