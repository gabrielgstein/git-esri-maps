'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _popup = require('../presentational-components/popup');

var _popup2 = _interopRequireDefault(_popup);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var hoverShown = state.hoverShown,
        hoverPosition = state.hoverPosition,
        hoverAttributes = state.hoverAttributes,
        hoverConfig = state.hoverConfig,
        selectedFeatures = state.selectedFeatures,
        partialSelectedFeatures = state.partialSelectedFeatures,
        hoverGraphicId = state.hoverGraphicId,
        hoverLayerId = state.hoverLayerId,
        hoverPromptConfig = state.hoverPromptConfig;

    return {
        shown: hoverShown,
        position: hoverPosition,
        attributes: hoverAttributes,
        config: hoverConfig,
        selectedFeatures: selectedFeatures,
        hoverGraphicId: hoverGraphicId,
        hoverLayerId: hoverLayerId,
        partialSelectedFeatures: partialSelectedFeatures,
        hoverPromptConfig: hoverPromptConfig
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onAppContainerScroll: function onAppContainerScroll() {
            dispatch(_actions2.default.appActions.onAppContainerScroll());
        },
        onClosePopup: function onClosePopup(force) {
            dispatch(_actions2.default.mapActions.closePopup(force));
        },
        onMouseOverPopup: function onMouseOverPopup(value) {
            dispatch(_actions2.default.mapActions.mouseOverPopup(value));
        },
        updatePopupPosition: function updatePopupPosition(position) {
            dispatch(_actions2.default.mapActions.updatePopupPosition(position));
        },
        onSelectFeatureChange: function onSelectFeatureChange(value, layerId, graphicId) {
            dispatch(_actions2.default.mapActions.onSelectFeatureChange(value, layerId, graphicId));
        },
        onApplyGraphicAsFilter: function onApplyGraphicAsFilter(layerId, graphicId) {
            setTimeout(function () {
                dispatch(_actions2.default.appActions.onClearPartialSelections());
            }, 0);

            setTimeout(function () {
                dispatch(_actions2.default.appActions.onClearAppliedSelections(true));
            }, 0);

            setTimeout(function () {
                dispatch(_actions2.default.mapActions.onSelectFeatureChange(true, layerId, graphicId));
            }, 0);

            setTimeout(function () {
                dispatch(_actions2.default.appActions.onApplyFilterSelection());
            }, 0);
        }
    };
};

var PopupContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_popup2.default);

exports.default = PopupContainer;
module.exports = exports['default'];