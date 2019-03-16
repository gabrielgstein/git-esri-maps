import { connect } from 'react-redux';
import FilterBar from '../presentational-components/filter-bar';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {
        selectedFeatures,
        appliedToFilter,
        partialSelectedFeatures,
    } = state;
    return {
        selectedFeatures,
        appliedToFilter,
        partialSelectedFeatures,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onApplyFilterSelection: () => {
            dispatch(Actions.appActions.onApplyFilterSelection());
        },
        onClearPartialSelections: () => {
            dispatch(Actions.appActions.onClearPartialSelections());
        },
        onClearAppliedSelections: () => {
            dispatch(Actions.appActions.onClearAppliedSelections());
        }
    }
};

const FilterBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterBar);

export default FilterBarContainer;
