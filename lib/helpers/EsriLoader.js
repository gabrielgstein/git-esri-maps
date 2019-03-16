'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _esriLoader = require('esri-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EsriLoader = function (_React$PureComponent) {
    _inherits(EsriLoader, _React$PureComponent);

    function EsriLoader() {
        _classCallCheck(this, EsriLoader);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    EsriLoader.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        if (!(0, _esriLoader.isLoaded)()) {

            (0, _esriLoader.bootstrap)(function (error) {

                if (_this2.props.ready) {
                    _this2.props.ready(error);
                }
            }, this.props.options);
        } else {

            if (this.props.ready) {
                this.props.ready();
            }
        }
    };

    EsriLoader.prototype.render = function render() {
        return null;
    };

    return EsriLoader;
}(_react2.default.PureComponent);

EsriLoader.propTypes = process.env.NODE_ENV !== "production" ? {
    options: _propTypes2.default.object,
    ready: _propTypes2.default.func
} : {};

exports.default = EsriLoader;
module.exports = exports['default'];