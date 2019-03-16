'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterBar = function (_BaseComponent) {
    _inherits(FilterBar, _BaseComponent);

    function FilterBar() {
        var _temp, _this, _ret;

        _classCallCheck(this, FilterBar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'filter-bar', _temp), _possibleConstructorReturn(_this, _ret);
    }

    FilterBar.prototype.render = function render() {
        var _props = this.props,
            selectedFeatures = _props.selectedFeatures,
            appliedToFilter = _props.appliedToFilter,
            partialSelectedFeatures = _props.partialSelectedFeatures,
            onApplyFilterSelection = _props.onApplyFilterSelection,
            onClearPartialSelections = _props.onClearPartialSelections,
            onClearAppliedSelections = _props.onClearAppliedSelections;


        var partialSelectedFeaturesCount = Object.keys(partialSelectedFeatures).length;
        var selectedFeaturesCount = Object.keys(selectedFeatures).length;
        var appliedToFilterCount = Object.keys(appliedToFilter).length;

        if (partialSelectedFeaturesCount === 0 && selectedFeaturesCount === 0) return null;

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('icon') },
                _UIHelper2.default.getIcon('Funnel', { style: { width: 18, height: 18 } })
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('info') },
                selectedFeaturesCount + partialSelectedFeaturesCount,
                ' ',
                (0, _scope.translate)('FILTER_BAR.FEATURES_SELECTED'),
                appliedToFilterCount ? ' - ' + appliedToFilterCount + (' ' + (0, _scope.translate)('FILTER_BAR.APPLIED_FILTER')) : null
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('actions') },
                partialSelectedFeaturesCount ? _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'top', title: (0, _scope.translate)('FILTER_BAR.CLEAR_NOT_APPLIED') },
                    _react2.default.createElement(_antd.Button, { shape: 'circle', icon: 'close', size: "small", onClick: onClearPartialSelections })
                ) : null,
                partialSelectedFeaturesCount ? _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'top', title: (0, _scope.translate)('FILTER_BAR.APPLY_SELECTIONS') },
                    _react2.default.createElement(
                        _antd.Button,
                        { type: 'primary', icon: 'check', size: "small", onClick: onApplyFilterSelection },
                        (0, _scope.translate)('FILTER_BAR.APPLY_SELECTIONS')
                    )
                ) : null,
                appliedToFilterCount ? _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'top', title: (0, _scope.translate)('FILTER_BAR.REMOVE_FILTERS') },
                    _react2.default.createElement(_antd.Button, { icon: 'delete', shape: "circle", size: "small", type: "danger", onClick: onClearAppliedSelections })
                ) : null
            )
        );
    };

    return FilterBar;
}(_BaseComponent3.default);

exports.default = FilterBar;
module.exports = exports['default'];