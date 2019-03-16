'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _antd = require('antd');

var _materialUiIcons = require('material-ui-icons');

var MaterialIcons = _interopRequireWildcard(_materialUiIcons);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _panelModule = require('../panel-module');

var _panelModule2 = _interopRequireDefault(_panelModule);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _scope = require('../../scope');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PanelComponent = (_temp2 = _class = function (_BaseComponent) {
    _inherits(PanelComponent, _BaseComponent);

    function PanelComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, PanelComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'panel-component', _temp), _possibleConstructorReturn(_this, _ret);
    }

    PanelComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            rulerEnabled = _props.rulerEnabled,
            panels = _props.panels,
            onModuleChange = _props.onModuleChange,
            currentModule = _props.currentModule,
            featureInfo = _props.featureInfo;
        var attributes = featureInfo.attributes;


        var getPanelStyle = function getPanelStyle(panel) {

            var defaultStyle = {
                backgroundColor: currentModule === panel.title ? '#154673' : '#b6b7b8'
            };

            var customStyle = {};

            switch (panel.title) {
                case 'PANEL.MEASUREMENT':
                    customStyle.display = rulerEnabled ? 'block' : 'none';
                    break;
                case 'PANEL.INFO_PANEL':
                    customStyle.display = attributes ? 'block' : 'none';
                    break;
                default:
            }

            return Object.assign(defaultStyle, customStyle);
        };

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('icons') },
                panels.map(function (panel) {
                    var icon = _UIHelper2.default.getIcon(panel.icon);
                    return _react2.default.createElement(
                        'div',
                        {
                            className: _this2.class(panel.bottom ? 'icon bottom' : 'icon'),
                            style: getPanelStyle(panel),
                            key: panel.title
                        },
                        _react2.default.createElement(
                            _antd.Tooltip,
                            { placement: 'left', title: (0, _scope.translate)(panel.title) },
                            _react2.default.createElement(
                                _IconButton2.default,
                                { classes: { root: _this2.baseClass + '-module-icon' }, onClick: function onClick() {
                                        return onModuleChange(panel.title);
                                    } },
                                icon
                            )
                        )
                    );
                })
            ),
            _react2.default.createElement('div', { className: this.class('helper-bar'), onClick: function onClick() {
                    return onModuleChange(currentModule);
                } }),
            _react2.default.createElement(
                'div',
                { className: this.class('modules') },
                this.props.panels.map(function (panel) {
                    return _react2.default.createElement(_panelModule2.default, _extends({ key: panel.title }, panel, { currentModule: _this2.props.currentModule === panel.title }));
                })
            )
        );
    };

    return PanelComponent;
}(_BaseComponent3.default), _class.propTypes = {
    panels: _propTypes2.default.array,
    currentModule: _propTypes2.default.string,
    rulerEnabled: _propTypes2.default.bool
}, _temp2);
exports.default = PanelComponent;
module.exports = exports['default'];