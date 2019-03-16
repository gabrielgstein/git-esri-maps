'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _antd = require('antd');

var _FeatureHelper = require('../../helpers/FeatureHelper');

var _FeatureHelper2 = _interopRequireDefault(_FeatureHelper);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopupComponent = function (_BaseComponent) {
    _inherits(PopupComponent, _BaseComponent);

    function PopupComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, PopupComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'popup-component', _this.state = {
            top: undefined,
            left: undefined
        }, _this.timer = undefined, _this.showPopup = function () {
            var popup = _this.popup || {};

            var currentHeight = popup.offsetHeight;
            var currentWidth = popup.offsetWidth;

            var clear = function clear() {
                if (_this.timer) {
                    clearInterval(_this.timer);
                    delete _this.timer;
                }
            };

            clear();

            var attempts = 0;

            var attemptShowFn = function attemptShowFn() {
                if (currentHeight === popup.offsetHeight && currentWidth === popup.offsetWidth) {
                    attempts += 1;
                } else {
                    currentHeight = popup.offsetHeight;
                    currentWidth = popup.offsetWidth;
                    attempts = 0;
                }

                if (attempts === 20) {
                    _this.updatePopupPosition(_this.props);
                    clear();
                }
            };

            _this.timer = setInterval(attemptShowFn, 50);

            attemptShowFn();
        }, _this.updatePopupPosition = function (props) {
            var position = props.position;

            var _ref = position || {},
                x = _ref.x,
                y = _ref.y;

            var popup = _this.popup;
            var top = y - popup.offsetHeight - 10;
            var left = x - popup.offsetWidth / 2;
            _this.setState(function (state) {
                return (0, _immutabilityHelper2.default)(state, {
                    top: {
                        $set: top
                    },
                    left: {
                        $set: left
                    }
                });
            });
        }, _this.renderMetrics = function (metrics) {

            return metrics.map(function (metric, index) {

                return _react2.default.createElement(
                    'div',
                    { className: _this.class('metric'), key: index },
                    _react2.default.createElement(
                        'div',
                        { className: _this.class('label') },
                        _this.getGroupedTexts(metric.label)
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _this.class('value') },
                        _this.getGroupedTexts(metric.value)
                    )
                );
            });
        }, _this.getGroupedTexts = function (group) {
            var feature = _this.props.feature;

            var attributes = feature.attributes;

            return _FeatureHelper2.default.getMetrics(group, attributes);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    PopupComponent.prototype.componentDidMount = function componentDidMount() {};

    PopupComponent.prototype.componentWillUnmount = function componentWillUnmount() {};

    PopupComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.updatePopupPosition(nextProps);
    };

    PopupComponent.prototype.render = function render() {
        var _this2 = this;

        var props = this.props;
        var shown = props.shown,
            onClosePopup = props.onClosePopup,
            updatePopupPosition = props.updatePopupPosition,
            onSelectFeatureChange = props.onSelectFeatureChange,
            attributes = props.attributes,
            config = props.config,
            onMouseOverPopup = props.onMouseOverPopup,
            selectedFeatures = props.selectedFeatures,
            partialSelectedFeatures = props.partialSelectedFeatures,
            hoverGraphicId = props.hoverGraphicId,
            hoverLayerId = props.hoverLayerId,
            hoverPromptConfig = props.hoverPromptConfig,
            onApplyGraphicAsFilter = props.onApplyGraphicAsFilter;
        var _state = this.state,
            top = _state.top,
            left = _state.left;


        var allSelectedFeatures = Object.assign({}, selectedFeatures, partialSelectedFeatures);

        var _ref2 = config || {},
            title = _ref2.title,
            subtitle = _ref2.subtitle,
            image = _ref2.image;

        if (shown) {
            this.showPopup();
        }

        var visible = shown && (image || title || subtitle || hoverPromptConfig);

        return _react2.default.createElement(
            'div',
            {
                className: this.class(),
                onMouseOver: function onMouseOver() {
                    return onMouseOverPopup(true);
                },
                onMouseLeave: function onMouseLeave() {
                    return onMouseOverPopup(false);
                },
                ref: function ref(el) {
                    return _this2.popup = el;
                },
                style: {
                    opacity: visible ? 1 : 0,
                    top: top || 0,
                    left: left || 0,
                    visibility: visible ? 'visible' : 'hidden'
                }
            },
            image && _react2.default.createElement(
                'div',
                { className: this.class('image') },
                _react2.default.createElement('img', { src: _FeatureHelper2.default.getMetrics(image, attributes), alt: '', onLoad: function onLoad() {
                        return _this2.updatePopupPosition(_this2.props);
                    } })
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('body') },
                title && _react2.default.createElement(
                    'div',
                    { className: this.class('title') },
                    _FeatureHelper2.default.getMetrics(title, attributes)
                ),
                subtitle && _react2.default.createElement(
                    'div',
                    { className: this.class('subtitle') },
                    _FeatureHelper2.default.getMetrics(subtitle, attributes)
                ),
                hoverPromptConfig ? _react2.default.createElement(
                    'div',
                    { className: this.class('actions') },
                    _react2.default.createElement(
                        'span',
                        { className: this.class('apply') },
                        _react2.default.createElement(
                            _antd.Button,
                            { type: 'primary', icon: 'check', onClick: function onClick() {
                                    return onApplyGraphicAsFilter(hoverLayerId, hoverGraphicId);
                                } },
                            (0, _scope.translate)('POPUP.APPLY_FILTER')
                        )
                    ),
                    _react2.default.createElement(
                        _antd.Checkbox,
                        { checked: !!allSelectedFeatures[hoverGraphicId], onChange: function onChange(e) {
                                return onSelectFeatureChange(e.target.checked, hoverLayerId, hoverGraphicId);
                            } },
                        (0, _scope.translate)('POPUP.SELECT')
                    )
                ) : null
            ),
            _react2.default.createElement('div', { className: 'arrow-down' })
        );
    };

    return PopupComponent;
}(_BaseComponent3.default);

exports.default = PopupComponent;
module.exports = exports['default'];