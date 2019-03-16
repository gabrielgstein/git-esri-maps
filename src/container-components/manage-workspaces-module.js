import { connect } from 'react-redux';
import ManageWorkspacesModule from '../presentational-components/manage-workspaces-module';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {workspaces} = state;
    return {
        workspaces
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeWorkspace: (workspaceId) => {
            dispatch(Actions.appActions.changeWorkspace(workspaceId));
        }
    }
};

const ManageWorkspacesModuleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageWorkspacesModule);

export default ManageWorkspacesModuleContainer;
