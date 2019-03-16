'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasurementModule = function (_BaseComponent) {
    _inherits(MeasurementModule, _BaseComponent);

    function MeasurementModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, MeasurementModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'measurement-widget', _temp), _possibleConstructorReturn(_this, _ret);
    }

    MeasurementModule.prototype.render = function render() {

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement('div', { id: 'measurement-widget' })
            )
        );
    };

    return MeasurementModule;
}(_BaseComponent3.default);

exports.default = MeasurementModule;
module.exports = exports['default'];