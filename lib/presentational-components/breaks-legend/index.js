'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _scope = require('../../scope');

var _stringMask = require('string-mask');

var _stringMask2 = _interopRequireDefault(_stringMask);

var _antd = require('antd');

var _customizeRenderer = require('../../container-components/customize-renderer');

var _customizeRenderer2 = _interopRequireDefault(_customizeRenderer);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BreaksLegendComponent = (_temp2 = _class = function (_BaseComponent) {
    _inherits(BreaksLegendComponent, _BaseComponent);

    function BreaksLegendComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, BreaksLegendComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'breaks-legend', _this.state = {
            customizeVisible: false
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    BreaksLegendComponent.prototype.fillZeros = function fillZeros() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


        var zeros = '';

        for (var c = 0; c < count; c++) {
            zeros += '0';
        }

        return zeros;
    };

    BreaksLegendComponent.prototype.render = function render() {
        var _this2 = this;

        var colors = [];
        var _props = this.props,
            preview = _props.preview,
            renderer = _props.renderer,
            type = _props.type,
            layerId = _props.layerId,
            onCustomizeLegend = _props.onCustomizeLegend;
        var breaks = renderer.breaks,
            values = renderer.values,
            prefix = renderer.prefix,
            suffix = renderer.suffix,
            metricLabel = renderer.metricLabel,
            thousandSeparator = renderer.thousandSeparator,
            decimalSeparator = renderer.decimalSeparator,
            dynamicBreaks = renderer.dynamicBreaks,
            legendTitle = renderer.legendTitle;

        var sizes = [];
        var hasSize = void 0;
        var style = {};
        var precision = dynamicBreaks ? dynamicBreaks.precision : 0;
        var textElements = [];
        var previewContent = void 0,
            defaultContent = void 0;

        var renderLabel = function renderLabel(_ref) {
            var breakConfig = _ref.breakConfig,
                minValue = _ref.minValue,
                maxValue = _ref.maxValue,
                value = _ref.value;

            var maskPattern = '';

            if (thousandSeparator) {
                maskPattern += '#' + thousandSeparator + '##0';
            }

            if (decimalSeparator && maskPattern) {
                maskPattern += decimalSeparator + _this2.fillZeros(precision);
            } else if (decimalSeparator) {
                maskPattern += '#' + decimalSeparator + _this2.fillZeros(precision);
            }

            if (maskPattern) {
                if (value) {
                    value = _stringMask2.default.apply(value.toFixed(precision).replace('.', ''), maskPattern, { reverse: true });
                } else {
                    minValue = _stringMask2.default.apply(minValue.toFixed(precision).replace('.', ''), maskPattern, { reverse: true });
                    maxValue = _stringMask2.default.apply(maxValue.toFixed(precision).replace('.', ''), maskPattern, { reverse: true });
                }
            }

            if (value) {
                return breakConfig.label || '' + (prefix ? prefix : '') + value + (suffix ? suffix : '') + ' ' + (metricLabel ? metricLabel : '');
            } else {
                return breakConfig.label || '' + (prefix ? prefix : '') + minValue + (suffix ? suffix : '') + ' ' + (0, _scope.translate)('BREAKS_LEGEND.TO') + ' ' + (prefix ? prefix : '') + (maxValue === Infinity ? (0, _scope.translate)('BREAKS_LEGEND.MORE_THAN') : maxValue) + (suffix ? suffix : '') + ' ' + (metricLabel ? metricLabel : '');
            }
        };

        if (breaks) {
            (breaks || []).forEach(function (breakConfig, index) {
                var minValue = breakConfig.minValue,
                    maxValue = breakConfig.maxValue,
                    color = breakConfig.color,
                    size = breakConfig.size,
                    borderColor = breakConfig.borderColor,
                    borderWidth = breakConfig.borderWidth,
                    value = breakConfig.value;


                Object.assign(style, { borderColor: borderColor, borderWidth: borderWidth });

                if (size) {
                    if (sizes.indexOf(size) === -1) {
                        sizes.push(size);
                    }
                }

                if (Array.isArray(color)) {
                    colors.push('rgba(' + color.join(',') + ')');
                } else {
                    colors.push(color || '#154673');
                }

                var label = renderLabel({ breakConfig: breakConfig, minValue: minValue, maxValue: maxValue, value: value });

                textElements.push(_react2.default.createElement(
                    'div',
                    { key: index, title: label, className: _this2.class('label') },
                    label
                ));
            });
            hasSize = sizes.length > 1;
            style.background = 'linear-gradient(to right,' + colors.join(',') + ')';
            previewContent = _react2.default.createElement(
                'div',
                { className: this.class('body') },
                _react2.default.createElement('div', {
                    className: this.class('bar'),
                    style: style
                })
            );
            defaultContent = _react2.default.createElement(
                'div',
                { className: this.class('body') },
                hasSize ? _react2.default.createElement(
                    'div',
                    { className: 'main' },
                    _react2.default.createElement(
                        'div',
                        { className: 'outer-mask' },
                        _react2.default.createElement(
                            'div',
                            { className: 'inner-mask' },
                            _react2.default.createElement('div', { className: 'content', style: style })
                        )
                    )
                ) : _react2.default.createElement('div', { className: this.class('bar'), style: style }),
                _react2.default.createElement(
                    'div',
                    { className: this.class('textual') },
                    textElements
                )
            );
        } else if (values) {
            (values || []).forEach(function (valueConfig, index) {
                var value = valueConfig.value,
                    url = valueConfig.url,
                    minValue = valueConfig.minValue,
                    maxValue = valueConfig.maxValue;

                var label = renderLabel({ breakConfig: valueConfig, value: value, minValue: minValue, maxValue: maxValue });

                textElements.push(_react2.default.createElement(
                    'div',
                    { key: index, className: _this2.class('item') },
                    !url && _UIHelper2.default.getLegendSymbol(valueConfig, _this2.class('symbol')),
                    url && _react2.default.createElement('img', { className: _this2.class('image'), src: url }),
                    !preview && _react2.default.createElement(
                        'span',
                        { title: label, className: _this2.class('label') },
                        label
                    )
                ));
            });
            previewContent = _react2.default.createElement(
                'div',
                { className: this.class('body') },
                _react2.default.createElement('div', { key: 'overflow-bar', className: this.class('overflow-bar') }),
                textElements
            );
            defaultContent = _react2.default.createElement(
                'div',
                { className: this.class('body'), style: { flexWrap: 'wrap' } },
                textElements
            );
        }

        var previewLegend = function previewLegend() {
            return _react2.default.createElement(
                'div',
                { className: _this2.class('preview') },
                previewContent
            );
        };

        var handleVisibleChange = function handleVisibleChange(visible) {
            if (visible) {
                onCustomizeLegend(layerId, type);
                _this2.setState({ customizeVisible: true });
            }
        };

        var defaultLegend = function defaultLegend() {
            style.background = 'linear-gradient(' + colors.join(',') + ')';
            return _react2.default.createElement(
                'div',
                { className: _this2.class('default') },
                _react2.default.createElement(
                    'div',
                    { className: _this2.class('header') },
                    _react2.default.createElement(
                        'div',
                        { className: _this2.class('title') },
                        legendTitle || (0, _scope.translate)('BREAKS_LEGEND.LEGEND')
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: _this2.class('edit') },
                        _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'bottomRight', visible: _this2.state.customizeVisible, content: _this2.state.customizeVisible ? _react2.default.createElement(_customizeRenderer2.default, { onClose: function onClose() {
                                        return _this2.setState({ customizeVisible: false });
                                    }, layerId: layerId, renderer: renderer, type: type }) : null, trigger: 'click', onVisibleChange: handleVisibleChange },
                            _react2.default.createElement(_antd.Icon, { type: "edit", style: { cursor: 'pointer' } })
                        )
                    )
                ),
                defaultContent
            );
        };

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            preview ? previewLegend() : defaultLegend()
        );
    };

    return BreaksLegendComponent;
}(_BaseComponent3.default), _class.propTypes = {
    breaks: _propTypes2.default.array,
    prefix: _propTypes2.default.string,
    suffix: _propTypes2.default.string,
    metricLabel: _propTypes2.default.string
}, _temp2);
exports.default = BreaksLegendComponent;
module.exports = exports['default'];