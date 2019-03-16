'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _layer = require('../../container-components/layer');

var _layer2 = _interopRequireDefault(_layer);

var _scope = require('../../scope');

var _antd = require('antd');

var _reactSortableHoc = require('react-sortable-hoc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortableLayers = (0, _reactSortableHoc.SortableContainer)(function (_ref) {
    var layersElements = _ref.layersElements;

    return _react2.default.createElement(
        'section',
        { className: 'layers-module' },
        layersElements
    );
});

var LayersModule = function (_BaseComponent) {
    _inherits(LayersModule, _BaseComponent);

    function LayersModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, LayersModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'layers-module', _temp), _possibleConstructorReturn(_this, _ret);
    }

    LayersModule.prototype.render = function render() {
        var _props = this.props,
            workspace = _props.workspace,
            mapLoaded = _props.mapLoaded,
            onReorderLayer = _props.onReorderLayer,
            onAddLayer = _props.onAddLayer;
        var layersOrder = workspace.layersOrder;


        var layersElements = [];

        layersOrder.forEach(function (layerIndex, index) {

            layersElements.push(_react2.default.createElement(_layer2.default, {
                collection: 'item',
                key: layerIndex,
                layerId: layerIndex,
                index: index
            }));
        });

        return mapLoaded && _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('actions') },
                _react2.default.createElement(
                    _antd.Button,
                    { type: "primary", icon: 'plus', onClick: onAddLayer },
                    (0, _scope.translate)('LAYERS_MODULE.ADD_LAYER')
                )
            ),
            _react2.default.createElement(SortableLayers, {
                layersElements: layersElements,
                lockToContainerEdges: true,
                lockAxis: 'y',
                useDragHandle: true,
                helperClass: 'dragging',
                onSortEnd: onReorderLayer
            })
        );
    };

    return LayersModule;
}(_BaseComponent3.default);

exports.default = LayersModule;
module.exports = exports['default'];