'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _antd = require('antd');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _customizeRenderer = require('../../container-components/customize-renderer');

var _customizeRenderer2 = _interopRequireDefault(_customizeRenderer);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleLegendComponent = function (_BaseComponent) {
    _inherits(SimpleLegendComponent, _BaseComponent);

    function SimpleLegendComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, SimpleLegendComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'simple-legend', _this.state = {
            customizeVisible: false
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    SimpleLegendComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            preview = _props.preview,
            type = _props.type,
            renderer = _props.renderer,
            layerId = _props.layerId,
            onCustomizeLegend = _props.onCustomizeLegend;
        var values = renderer.values,
            prefix = renderer.prefix,
            suffix = renderer.suffix,
            metricLabel = renderer.metricLabel,
            legendTitle = renderer.legendTitle;

        var textElements = [];

        (values || []).forEach(function (valueConfig, index) {
            var value = valueConfig.value,
                url = valueConfig.url;


            var label = valueConfig.label || '' + (prefix ? prefix : '') + value + (suffix ? suffix : '') + ' ' + (metricLabel ? metricLabel : '');
            textElements.push(_react2.default.createElement(
                'div',
                { key: index, className: _this2.class('item') },
                !url && _UIHelper2.default.getLegendSymbol(valueConfig, _this2.class('symbol')),
                url && _react2.default.createElement('img', { className: _this2.class('image'), src: url }),
                !preview && _react2.default.createElement(
                    'span',
                    { className: _this2.class('label') },
                    label
                )
            ));
        });

        var previewLegend = function previewLegend() {
            return _react2.default.createElement(
                'div',
                { className: _this2.class('preview') },
                _react2.default.createElement(
                    'div',
                    { className: _this2.class('body') },
                    _react2.default.createElement('div', { className: _this2.class('overflow-bar') }),
                    textElements
                )
            );
        };

        var handleVisibleChange = function handleVisibleChange(visible) {
            if (visible) {
                onCustomizeLegend(layerId, type);
                _this2.setState({ customizeVisible: true });
            }
        };

        var defaultLegend = function defaultLegend() {
            return _react2.default.createElement(
                'div',
                { className: _this2.class('default') },
                _react2.default.createElement(
                    'div',
                    { className: _this2.class('header') },
                    _react2.default.createElement(
                        'div',
                        { className: _this2.class('title') },
                        legendTitle || (0, _scope.translate)('SIMPLE_LEGEND.LEGEND')
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: _this2.class('edit') },
                        _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'bottomRight', visible: _this2.state.customizeVisible, content: _this2.state.customizeVisible ? _react2.default.createElement(_customizeRenderer2.default, { onClose: function onClose() {
                                        return _this2.setState({ customizeVisible: false });
                                    }, layerId: layerId, renderer: renderer, type: type }) : null, trigger: 'click', onVisibleChange: handleVisibleChange },
                            _react2.default.createElement(_antd.Icon, { type: "edit" })
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: _this2.class('body') },
                    textElements
                )
            );
        };

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            preview ? previewLegend() : defaultLegend()
        );
    };

    return SimpleLegendComponent;
}(_BaseComponent3.default);

exports.default = SimpleLegendComponent;
module.exports = exports['default'];