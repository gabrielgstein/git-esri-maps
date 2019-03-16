'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _manageWorkspacesModule = require('../presentational-components/manage-workspaces-module');

var _manageWorkspacesModule2 = _interopRequireDefault(_manageWorkspacesModule);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var workspaces = state.workspaces;

    return {
        workspaces: workspaces
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        changeWorkspace: function changeWorkspace(workspaceId) {
            dispatch(_actions2.default.appActions.changeWorkspace(workspaceId));
        }
    };
};

var ManageWorkspacesModuleContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_manageWorkspacesModule2.default);

exports.default = ManageWorkspacesModuleContainer;
module.exports = exports['default'];