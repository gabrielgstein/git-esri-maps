'use strict';

exports.__esModule = true;

var _reactRedux = require('react-redux');

var _filterBar = require('../presentational-components/filter-bar');

var _filterBar2 = _interopRequireDefault(_filterBar);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    var selectedFeatures = state.selectedFeatures,
        appliedToFilter = state.appliedToFilter,
        partialSelectedFeatures = state.partialSelectedFeatures;

    return {
        selectedFeatures: selectedFeatures,
        appliedToFilter: appliedToFilter,
        partialSelectedFeatures: partialSelectedFeatures
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onApplyFilterSelection: function onApplyFilterSelection() {
            dispatch(_actions2.default.appActions.onApplyFilterSelection());
        },
        onClearPartialSelections: function onClearPartialSelections() {
            dispatch(_actions2.default.appActions.onClearPartialSelections());
        },
        onClearAppliedSelections: function onClearAppliedSelections() {
            dispatch(_actions2.default.appActions.onClearAppliedSelections());
        }
    };
};

var FilterBarContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_filterBar2.default);

exports.default = FilterBarContainer;
module.exports = exports['default'];