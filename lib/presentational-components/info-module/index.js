'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _FeatureHelper = require('../../helpers/FeatureHelper');

var _FeatureHelper2 = _interopRequireDefault(_FeatureHelper);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoModule = function (_BaseComponent) {
    _inherits(InfoModule, _BaseComponent);

    function InfoModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, InfoModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'info-module', _this.renderMetrics = function (metrics) {
            var attributes = _this.props.attributes;


            return metrics.map(function (metric, index) {

                return _react2.default.createElement(
                    'div',
                    { className: _this.class('metric'), key: index },
                    _react2.default.createElement(
                        'div',
                        { className: _this.class('label') },
                        _FeatureHelper2.default.getMetrics(metric.label, attributes)
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _this.class('value') },
                        _FeatureHelper2.default.getMetrics(metric.value, attributes)
                    )
                );
            });
        }, _this.generateDefaultMetrics = function (attributes, fields) {
            var metrics = [];

            if (attributes) {

                var aliases = {};

                if (fields) {
                    for (var _iterator = fields, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                        var _ref;

                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            _i = _iterator.next();
                            if (_i.done) break;
                            _ref = _i.value;
                        }

                        var field = _ref;

                        if (field.alias) {
                            aliases[field.name] = field.alias;
                        }
                    }
                }

                for (var attr in attributes) {
                    if (attributes.hasOwnProperty(attr) && attr !== '__geo') {
                        metrics.push({
                            label: [{
                                prefix: aliases[attr] || attr,
                                suffix: ': '
                            }],
                            value: [{
                                metric: attr
                            }]
                        });
                    }
                }
            }

            return metrics;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    InfoModule.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            infoPanel = _props.infoPanel,
            attributes = _props.attributes,
            fields = _props.fields,
            symbolInfo = _props.symbolInfo,
            renderer = _props.renderer;

        var _ref2 = infoPanel || {},
            image = _ref2.image,
            title = _ref2.title,
            subtitle = _ref2.subtitle,
            metrics = _ref2.metrics;

        var finalMetrics = metrics || this.generateDefaultMetrics(attributes, fields);

        if (!attributes) return null;

        var thisLayerElements = [];

        (symbolInfo || []).forEach(function (symbol) {
            var shape = symbol.shape,
                color = symbol.color,
                value = symbol.value,
                minValue = symbol.minValue,
                maxValue = symbol.maxValue;


            if (shape && renderer.shape) {
                var _shape = renderer.shape;
                var prefix = _shape.prefix,
                    suffix = _shape.suffix,
                    metricLabel = _shape.metricLabel;

                var label = void 0;
                if (value !== undefined) {
                    label = symbol.label || '' + (prefix ? prefix : '') + value + (suffix ? suffix : '') + ' ' + (metricLabel ? metricLabel : '');
                } else {
                    label = symbol.label || '' + (prefix ? prefix : '') + minValue + (suffix ? suffix : '') + ' to ' + (prefix ? prefix : '') + (maxValue === Infinity ? 'More than' : maxValue) + (suffix ? suffix : '') + ' ' + (metricLabel ? metricLabel : '');
                }
                thisLayerElements.push(_react2.default.createElement(
                    'div',
                    { className: _this2.class('item'), key: 'shape' },
                    _UIHelper2.default.getLegendSymbol(symbol, _this2.class('symbol')),
                    _react2.default.createElement(
                        'span',
                        { className: _this2.class('label') },
                        label
                    )
                ));
            }

            if (color && renderer.color) {
                var _color = renderer.color;
                var _prefix = _color.prefix,
                    _suffix = _color.suffix,
                    _metricLabel = _color.metricLabel;

                var _label = void 0;
                if (value !== undefined) {
                    _label = symbol.label || '' + (_prefix ? _prefix : '') + value + (_suffix ? _suffix : '') + ' ' + (_metricLabel ? _metricLabel : '');
                } else {
                    _label = symbol.label || '' + (_prefix ? _prefix : '') + minValue + (_suffix ? _suffix : '') + ' ' + (0, _scope.translate)('INFO_MODULE.TO') + ' ' + (_prefix ? _prefix : '') + (maxValue === Infinity ? (0, _scope.translate)('INFO_MODULE.MORE_THAN') : maxValue) + (_suffix ? _suffix : '') + ' ' + (_metricLabel ? _metricLabel : '');
                }
                thisLayerElements.push(_react2.default.createElement(
                    'div',
                    { className: _this2.class('item'), key: 'color' },
                    _UIHelper2.default.getLegendSymbol(symbol, _this2.class('symbol')),
                    _react2.default.createElement(
                        'span',
                        { className: _this2.class('label') },
                        _label
                    )
                ));
            }
        });

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            image ? _react2.default.createElement(
                'div',
                { className: this.class('image') },
                _react2.default.createElement('img', { src: _FeatureHelper2.default.getMetrics(image, attributes), alt: '' })
            ) : null,
            _react2.default.createElement(
                'div',
                { className: this.class('header') },
                title ? _react2.default.createElement(
                    'div',
                    { className: this.class('title') },
                    _FeatureHelper2.default.getMetrics(title, attributes)
                ) : null,
                subtitle ? _react2.default.createElement(
                    'div',
                    { className: this.class('subtitle') },
                    _FeatureHelper2.default.getMetrics(subtitle, attributes)
                ) : null
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('feature-info') },
                _react2.default.createElement(
                    'div',
                    { className: this.class('text') },
                    (0, _scope.translate)('INFO_MODULE.FROM_FEATURE')
                ),
                thisLayerElements
            ),
            _react2.default.createElement('div', { className: this.class('feature-details') }),
            _react2.default.createElement('div', { className: this.class('feature-data') }),
            _react2.default.createElement(
                'div',
                { className: this.class('text') },
                (0, _scope.translate)('INFO_MODULE.DATA')
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('metrics-container') },
                _react2.default.createElement(
                    'div',
                    { className: this.class('metrics') },
                    this.renderMetrics(finalMetrics)
                )
            )
        );
    };

    return InfoModule;
}(_BaseComponent3.default);

exports.default = InfoModule;
module.exports = exports['default'];