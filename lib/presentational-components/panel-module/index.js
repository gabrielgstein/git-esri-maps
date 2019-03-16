'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _materialUiIcons = require('material-ui-icons');

var MaterialIcons = _interopRequireWildcard(_materialUiIcons);

var _AddCircleOutline = require('material-ui-icons/AddCircleOutline');

var _AddCircleOutline2 = _interopRequireDefault(_AddCircleOutline);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _scope = require('../../scope');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PanelModule = (_temp2 = _class = function (_BaseComponent) {
    _inherits(PanelModule, _BaseComponent);

    function PanelModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, PanelModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'panel-module', _temp), _possibleConstructorReturn(_this, _ret);
    }

    PanelModule.prototype.render = function render() {
        var _props = this.props,
            title = _props.title,
            actions = _props.actions,
            currentModule = _props.currentModule,
            ModuleClass = _props.ModuleClass;


        return _react2.default.createElement(
            'section',
            { className: this.class(), style: { display: currentModule ? 'flex' : 'none' } },
            _react2.default.createElement(
                'header',
                { className: this.class('header') },
                _react2.default.createElement(
                    'div',
                    { className: this.class('title') },
                    (0, _scope.translate)(title)
                ),
                _react2.default.createElement(
                    'div',
                    { className: this.class('expander') },
                    actions && actions.map(function (action, index) {
                        var IconClass = MaterialIcons[action.icon];
                        return _react2.default.createElement(
                            _IconButton2.default,
                            { key: index, 'aria-label': '' },
                            _react2.default.createElement(IconClass, null)
                        );
                    })
                )
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('content') },
                ModuleClass && _react2.default.createElement(ModuleClass, null)
            )
        );
    };

    return PanelModule;
}(_BaseComponent3.default), _class.propTypes = {
    title: _propTypes2.default.string,
    content: _propTypes2.default.any,
    icon: _propTypes2.default.string,
    currentModule: _propTypes2.default.bool,
    ModuleClass: _propTypes2.default.any
}, _temp2);
exports.default = PanelModule;
module.exports = exports['default'];