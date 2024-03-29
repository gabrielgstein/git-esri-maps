'use strict';

exports.__esModule = true;
exports.default = exports.store = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _main = require('./reducers/main');

var _main2 = _interopRequireDefault(_main);

var _app = require('./container-components/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = exports.store = (0, _redux.createStore)(_main2.default);

var RootComponent = function (_Component) {
    _inherits(RootComponent, _Component);

    function RootComponent() {
        _classCallCheck(this, RootComponent);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    RootComponent.prototype.render = function render() {

        return _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(_app2.default, this.props)
        );
    };

    return RootComponent;
}(_react.Component);

exports.default = RootComponent;