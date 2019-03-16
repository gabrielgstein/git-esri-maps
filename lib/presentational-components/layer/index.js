'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _scope = require('../../scope');

var _Progress = require('material-ui/Progress');

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _reactSortableHoc = require('react-sortable-hoc');

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _breaksLegend = require('../breaks-legend');

var _breaksLegend2 = _interopRequireDefault(_breaksLegend);

var _simpleLegend = require('../simple-legend');

var _simpleLegend2 = _interopRequireDefault(_simpleLegend);

var _multipleLegend = require('../multiple-legend');

var _multipleLegend2 = _interopRequireDefault(_multipleLegend);

require('rc-slider/assets/index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragHandle = (0, _reactSortableHoc.SortableHandle)(function () {
    return _react2.default.createElement(
        'div',
        { className: 'cursor-move' },
        _react2.default.createElement(
            _antd.Tooltip,
            { placement: 'left', title: (0, _scope.translate)('LAYER.REORDER') },
            _UIHelper2.default.getIcon('DragVertical')
        )
    );
});

var LayerComponent = function (_BaseComponent) {
    _inherits(LayerComponent, _BaseComponent);

    function LayerComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, LayerComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'layer-component', _this.state = {
            measurementHeight: 40,
            selectedIndex: undefined,
            opacity: undefined,
            lastOpacitySent: undefined
        }, _this.updateContentHeight = function () {
            var measurementHeight = _this.state.measurementHeight;

            var newMeasure = _this.measurementContainer.scrollHeight;
            if (measurementHeight !== newMeasure) {
                _this.setState(function (state) {
                    return (0, _immutabilityHelper2.default)(state, {
                        measurementHeight: {
                            $set: newMeasure
                        }
                    });
                });
            }
        }, _this.normalize = function (props) {
            var layers = props.layers,
                layerId = props.layerId;
            var opacity = layers[layerId].opacity;


            _this.checkForBuild(props);
            _this.updateContentHeight();

            _this.setState(function (state) {
                return (0, _immutabilityHelper2.default)(state, {
                    opacity: {
                        $set: opacity
                    },
                    lastOpacitySent: {
                        $set: opacity
                    }
                });
            });
        }, _this.handleOpacityChange = function (finished, newOpacity, layerId) {
            var changeLayerOpacity = _this.props.changeLayerOpacity;
            var lastOpacitySent = _this.state.lastOpacitySent;

            var diff = newOpacity - lastOpacitySent;
            if (diff >= 10 || diff <= -10 || finished) {
                if (lastOpacitySent !== newOpacity) {
                    changeLayerOpacity(layerId, newOpacity);
                    _this.setState(function (state) {
                        return (0, _immutabilityHelper2.default)(state, {
                            lastOpacitySent: {
                                $set: newOpacity
                            },
                            opacity: {
                                $set: newOpacity
                            }
                        });
                    });
                }
            } else {
                _this.setState(function (state) {
                    return (0, _immutabilityHelper2.default)(state, {
                        opacity: {
                            $set: newOpacity
                        }
                    });
                });
            }
        }, _this.getLegend = function (type, renderer) {
            var _this$props = _this.props,
                layers = _this$props.layers,
                layerId = _this$props.layerId,
                onCustomizeLegend = _this$props.onCustomizeLegend;
            var expanded = layers[layerId].expanded;


            switch (type) {
                case 'Breaks':
                    if (renderer.breaks) {
                        return _react2.default.createElement(_breaksLegend2.default, { onCustomizeLegend: onCustomizeLegend, type: 'breaks', renderer: renderer, preview: !expanded, layerId: layerId });
                    }
                    break;
                case 'custom':
                case 'Custom':
                    if (renderer.multiple) {
                        return _react2.default.createElement(_multipleLegend2.default, { onCustomizeLegend: onCustomizeLegend, renderer: renderer, preview: !expanded, layerId: layerId });
                    }
                    break;
                case 'Stacked Bubble':
                case 'Feature Layer':
                case 'Simple':
                default:
                    if (renderer.values) {
                        return _react2.default.createElement(_simpleLegend2.default, { onCustomizeLegend: onCustomizeLegend, type: 'simple', renderer: renderer, preview: !expanded, layerId: layerId });
                    }

            }
        }, _this.checkForBuild = function (props) {
            var layers = props.layers,
                layerId = props.layerId,
                buildLayer = props.buildLayer;
            var _layers$layerId = layers[layerId],
                enabled = _layers$layerId.enabled,
                building = _layers$layerId.building,
                built = _layers$layerId.built;


            if (!built && enabled && !building) {
                buildLayer(layerId);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    LayerComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.normalize(nextProps);
    };

    LayerComponent.prototype.componentDidMount = function componentDidMount() {
        this.normalize(this.props);
    };

    LayerComponent.prototype.componentDidUpdate = function componentDidUpdate() {
        var _this2 = this;

        setTimeout(function () {
            _this2.updateContentHeight();
        }, 50);
    };

    LayerComponent.prototype.render = function render() {
        var _this3 = this;

        var _props = this.props,
            onSwitchToggle = _props.onSwitchToggle,
            onToggleExpand = _props.onToggleExpand,
            showLayer = _props.showLayer,
            centerAtLayer = _props.centerAtLayer,
            removeFromWorkspace = _props.removeFromWorkspace,
            layers = _props.layers,
            layerId = _props.layerId,
            onAddLayerSwipe = _props.onAddLayerSwipe;
        var _layers$layerId2 = layers[layerId],
            title = _layers$layerId2.title,
            enabled = _layers$layerId2.enabled,
            expanded = _layers$layerId2.expanded,
            building = _layers$layerId2.building,
            renderer = _layers$layerId2.renderer,
            type = _layers$layerId2.type,
            error = _layers$layerId2.error,
            insideZoomRange = _layers$layerId2.insideZoomRange,
            minZoom = _layers$layerId2.minZoom,
            maxZoom = _layers$layerId2.maxZoom;
        var _state = this.state,
            measurementHeight = _state.measurementHeight,
            opacity = _state.opacity;


        if (insideZoomRange !== undefined) {
            setTimeout(function () {
                showLayer(enabled === true ? insideZoomRange : enabled, layerId);
            }, 0);
        }

        var legend = void 0;

        if (renderer) {
            legend = this.getLegend(type, renderer);
        }

        var renderZoomRangeWarning = function renderZoomRangeWarning() {
            return insideZoomRange === false && _react2.default.createElement(
                'div',
                { className: _this3.class('zoom-range'), onClick: function onClick() {
                        return onAddLayerSwipe(layerId);
                    } },
                _react2.default.createElement(
                    'span',
                    { className: _this3.class('warning') },
                    'Visible from Zoom ',
                    minZoom,
                    ' to ',
                    maxZoom
                )
            );
        };

        var renderCollapsed = function renderCollapsed() {
            return _react2.default.createElement(
                'div',
                { className: _this3.class('content-collapsed'), style: { height: !expanded ? 'auto' : 0, opacity: !expanded ? 1 : 0 } },
                legend
            );
        };

        var renderExpanded = function renderExpanded() {

            return _react2.default.createElement(
                'div',
                { className: _this3.class('content-expanded'), style: { height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 } },
                error ? _react2.default.createElement(
                    'div',
                    { className: _this3.class('error') },
                    _UIHelper2.default.getIcon('BrokenImage', { style: { width: 42, height: 42 } }),
                    _react2.default.createElement(
                        'span',
                        null,
                        (0, _scope.translate)('LAYER.SOMETHING_WRONG')
                    )
                ) : _react2.default.createElement(
                    'div',
                    { className: _this3.class('content') },
                    _react2.default.createElement(
                        'div',
                        { className: _this3.class('footer') },
                        legend,
                        !legend && _react2.default.createElement(
                            'span',
                            { className: _this3.class('no-legend') },
                            (0, _scope.translate)('LAYER.LEGEND_NOT_AVAILABLE')
                        )
                    ),
                    renderZoomRangeWarning()
                )
            );
        };

        var sliderContent = _react2.default.createElement(
            'div',
            { className: this.class('slider') },
            _react2.default.createElement(_rcSlider2.default, {
                value: opacity,
                railStyle: { backgroundColor: '#acb0b1' },
                trackStyle: { backgroundColor: '#607176' },
                handleStyle: { border: 'solid 2px #3c474a' },
                onAfterChange: function onAfterChange(value) {
                    return _this3.handleOpacityChange(true, value, layerId);
                },
                onChange: function onChange(value) {
                    return _this3.handleOpacityChange(false, value, layerId);
                }
            })
        );

        var iconStyle = {
            fontSize: '24px'
        };

        var onMenuItemClick = function onMenuItemClick(_ref) {
            var key = _ref.key;

            switch (key) {
                case 'removeFromWorkspace':
                    removeFromWorkspace(layerId);
            }
        };

        var moreActionsMenu = _react2.default.createElement(
            _antd.Menu,
            { onClick: onMenuItemClick },
            _react2.default.createElement(
                _antd.Menu.Item,
                { key: "removeFromWorkspace" },
                _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement(_antd.Icon, { type: 'close' }),
                    ' ' + (0, _scope.translate)('LAYER.REMOVE')
                )
            )
        );

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('loading'), style: { display: building ? 'flex' : 'none' } },
                _react2.default.createElement(_antd.Icon, { type: "loading", style: { color: '#154673', fontSize: 28 } })
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('header') },
                _react2.default.createElement(DragHandle, null),
                _react2.default.createElement(
                    'div',
                    { className: this.class('expand'), onClick: function onClick() {
                            return onToggleExpand(layerId);
                        } },
                    _react2.default.createElement(
                        _antd.Tooltip,
                        { placement: 'top', title: expanded ? (0, _scope.translate)('LAYER.COLLAPSE') : (0, _scope.translate)('LAYER.EXPAND') },
                        _UIHelper2.default.getIcon(expanded ? 'ChevronUp' : 'ChevronDown')
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: this.class('main') },
                    _react2.default.createElement(
                        'div',
                        { className: this.class('title') },
                        _react2.default.createElement(
                            _antd.Tooltip,
                            { placement: 'top', title: title },
                            title
                        )
                    ),
                    !expanded && enabled ? renderCollapsed() : null
                ),
                enabled || expanded ? _react2.default.createElement(
                    'div',
                    { className: this.class('actions') },
                    _react2.default.createElement(
                        'div',
                        { className: this.class('visibility-slider') },
                        _react2.default.createElement(
                            _antd.Popover,
                            { content: sliderContent, title: (0, _scope.translate)('LAYER.VISIBILITY'), trigger: 'hover' },
                            _UIHelper2.default.getIcon('Opacity')
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: this.class('center'), onClick: function onClick() {
                                return centerAtLayer(layerId);
                            } },
                        _react2.default.createElement(
                            _antd.Tooltip,
                            { placement: 'top', title: (0, _scope.translate)('LAYER.CENTER_AT') },
                            _react2.default.createElement(_antd.Icon, { type: 'scan', style: iconStyle })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: this.class('toggle') },
                        _react2.default.createElement(_antd.Switch, {
                            checked: enabled,
                            size: "small",
                            onChange: function onChange() {
                                return onSwitchToggle(layerId);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: this.class('more-actions') },
                        _react2.default.createElement(
                            _antd.Dropdown,
                            { overlay: moreActionsMenu, placement: 'bottomRight' },
                            _react2.default.createElement(_antd.Icon, { type: 'ellipsis', size: "small", style: { cursor: 'pointer' } })
                        )
                    )
                ) : null
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('content'), style: { height: measurementHeight } },
                _react2.default.createElement(
                    'div',
                    { ref: function ref(el) {
                            return _this3.measurementContainer = el;
                        }, className: this.class('measurement') },
                    renderExpanded()
                )
            )
        );
    };

    return LayerComponent;
}(_BaseComponent3.default);

exports.default = LayerComponent;
module.exports = exports['default'];