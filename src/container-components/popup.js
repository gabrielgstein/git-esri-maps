import { connect } from 'react-redux';
import Popup from '../presentational-components/popup';
import Actions from '../actions';

const mapStateToProps = (state) => {
    const {
        hoverShown,
        hoverPosition,
        hoverAttributes,
        hoverConfig,
        selectedFeatures,
        partialSelectedFeatures,
        hoverGraphicId,
        hoverLayerId,
        hoverPromptConfig
    } = state;
    return {
        shown: hoverShown,
        position: hoverPosition,
        attributes: hoverAttributes,
        config: hoverConfig,
        selectedFeatures,
        hoverGraphicId,
        hoverLayerId,
        partialSelectedFeatures,
        hoverPromptConfig
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAppContainerScroll: () => {
            dispatch(Actions.appActions.onAppContainerScroll());
        },
        onClosePopup: (force) => {
            dispatch(Actions.mapActions.closePopup(force));
        },
        onMouseOverPopup: (value) => {
            dispatch(Actions.mapActions.mouseOverPopup(value));
        },
        updatePopupPosition: (position) => {
            dispatch(Actions.mapActions.updatePopupPosition(position));
        },
        onSelectFeatureChange: (value, layerId, graphicId) => {
            dispatch(Actions.mapActions.onSelectFeatureChange(value, layerId, graphicId));
        },
        onApplyGraphicAsFilter: (layerId, graphicId) => {
            setTimeout(() => {
                dispatch(Actions.appActions.onClearPartialSelections());
            }, 0);

            setTimeout(() => {
                dispatch(Actions.appActions.onClearAppliedSelections(true));
            }, 0);

            setTimeout(() => {
                dispatch(Actions.mapActions.onSelectFeatureChange(true, layerId, graphicId));
            }, 0);

            setTimeout(() => {
                dispatch(Actions.appActions.onApplyFilterSelection());
            }, 0);
        }
    }
};

const PopupContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Popup);

export default PopupContainer;
