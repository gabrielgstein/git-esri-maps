'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _breaksLegend = require('../breaks-legend');

var _breaksLegend2 = _interopRequireDefault(_breaksLegend);

var _simpleLegend = require('../simple-legend');

var _simpleLegend2 = _interopRequireDefault(_simpleLegend);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultipleLegendComponent = (_temp2 = _class = function (_BaseComponent) {
    _inherits(MultipleLegendComponent, _BaseComponent);

    function MultipleLegendComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, MultipleLegendComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'multiple-legend', _temp), _possibleConstructorReturn(_this, _ret);
    }

    MultipleLegendComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            preview = _props.preview,
            renderer = _props.renderer,
            layerId = _props.layerId,
            onCustomizeLegend = _props.onCustomizeLegend;
        var multiple = renderer.multiple,
            size = renderer.size,
            color = renderer.color,
            shape = renderer.shape;

        var legends = [];
        var previewLegends = [];

        if (color) {
            var _Object$assign;

            var first = multiple.colors[0] || {};
            var isUniqueValues = first.value !== undefined;
            legends.push(_react2.default.createElement(_breaksLegend2.default, { onCustomizeLegend: onCustomizeLegend, layerId: layerId, key: 'colors', type: 'color', renderer: Object.assign({}, color, (_Object$assign = {}, _Object$assign[isUniqueValues ? 'values' : 'breaks'] = multiple.colors, _Object$assign)), preview: preview }));
            previewLegends.push(legends[legends.length - 1]);
        }

        if (size) {
            var _Object$assign2;

            var _first = multiple.size[0] || {};
            var _isUniqueValues = _first.value !== undefined;
            legends.push(_react2.default.createElement(_breaksLegend2.default, { onCustomizeLegend: onCustomizeLegend, layerId: layerId, key: 'size', type: 'size', renderer: Object.assign({}, size, (_Object$assign2 = {}, _Object$assign2[_isUniqueValues ? 'values' : 'breaks'] = multiple.size, _Object$assign2)) }));
        }

        if (shape) {
            legends.push(_react2.default.createElement(_breaksLegend2.default, { onCustomizeLegend: onCustomizeLegend, layerId: layerId, key: 'shapes', type: 'shape', renderer: Object.assign({}, shape, { values: multiple.shapes }), preview: preview }));
            previewLegends.push(legends[legends.length - 1]);
        }

        var previewLegend = function previewLegend() {
            return _react2.default.createElement(
                'div',
                { className: _this2.class('preview') },
                previewLegends
            );
        };

        var defaultLegend = function defaultLegend() {
            return _react2.default.createElement(
                'div',
                { className: _this2.class('default') },
                legends
            );
        };

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            preview ? previewLegend() : defaultLegend()
        );
    };

    return MultipleLegendComponent;
}(_BaseComponent3.default), _class.propTypes = {}, _temp2);
exports.default = MultipleLegendComponent;
module.exports = exports['default'];