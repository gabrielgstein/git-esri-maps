'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _images = require('../../images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasemapsModule = function (_BaseComponent) {
    _inherits(BasemapsModule, _BaseComponent);

    function BasemapsModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, BasemapsModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'basemaps-module', _temp), _possibleConstructorReturn(_this, _ret);
    }

    BasemapsModule.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            basemapsList = _props.basemapsList,
            basemap = _props.basemap,
            changeBasemap = _props.changeBasemap;


        var basemapsElements = [];

        basemapsList.forEach(function (_basemap) {
            var image = _basemap.image,
                label = _basemap.label,
                type = _basemap.type;

            basemapsElements.push(_react2.default.createElement(
                'div',
                {
                    key: type,
                    className: _this2.class('basemap'),
                    onClick: function onClick() {
                        return changeBasemap(type);
                    },
                    style: { backgroundImage: 'url(' + _images2.default[image] + ')', transform: type === basemap ? 'scale(1.05)' : '' } },
                _react2.default.createElement(
                    'div',
                    { className: _this2.class('title') },
                    label
                )
            ));
        });

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            basemapsElements
        );
    };

    return BasemapsModule;
}(_BaseComponent3.default);

exports.default = BasemapsModule;
module.exports = exports['default'];