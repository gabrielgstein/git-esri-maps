import { connect } from 'react-redux';
import CatalogModule from '../presentational-components/catalog-module'
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {layers, enrichedSources, workspaces, currentWorkspace, currentWorkspaceSelection} = state;
    return {
        layers,
        enrichedSources,
        workspace: workspaces[currentWorkspace],
        currentWorkspaceSelection
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onWorkspaceSelectionChange: (workspaceSelection) => {
            dispatch(Actions.appActions.onWorkspaceSelection(workspaceSelection));
        },
        onApplyWorkspaceSelections: () => {
            dispatch(Actions.appActions.onApplyWorkspaceSelections());
        }
    }
};

const CatalogModuleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CatalogModule);

export default CatalogModuleContainer;
