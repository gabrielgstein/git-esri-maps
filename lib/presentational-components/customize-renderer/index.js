'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _scope = require('../../scope');

var _reactColor = require('react-color');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomizeRenderer = function (_BaseComponent) {
    _inherits(CustomizeRenderer, _BaseComponent);

    function CustomizeRenderer() {
        var _temp, _this, _ret;

        _classCallCheck(this, CustomizeRenderer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'customize-renderer', _this.state = {
            minValue: 0,
            maxValue: 100,
            classification: 'Equal Intervals',
            breakCount: 3,
            sliderValues: [],
            isUniqueValues: false,
            colors: ['#b23d2c', '#f2c84b'],
            paletteIndex: 0,
            colorRange: [],
            minSize: 10,
            maxSize: 60,
            shapes: ['diamond', 'circle', 'square', 'star'],
            defaultPopoverVisible: false,
            defaultShape: 'circle',
            defaultSize: 10,
            defaultColor: 'blue',
            legendTitle: 'Legend'
        }, _this.normalize = function (props) {
            var currentType = _this.state.currentType;
            var layerId = props.layerId,
                customizeLayer = props.customizeLayer;

            var layerRenderer = customizeLayer[layerId][currentType];

            var _this$state = _this.state,
                colors = _this$state.colors,
                legendTitle = _this$state.legendTitle,
                breakCount = _this$state.breakCount;
            var custom = layerRenderer.custom;

            var firstElement = custom[0] || {};

            var isUniqueValues = (custom.length && firstElement.value) !== undefined;

            var newState = {
                sliderValues: custom,
                legendTitle: layerRenderer.legendTitle || legendTitle,
                breakCount: isUniqueValues ? breakCount : custom.length || breakCount,
                isUniqueValues: isUniqueValues
            };

            if (!isUniqueValues) {
                var first = custom[0] || {};
                var next = custom[custom.length - 1] || {};
                newState.minValue = first.minValue;
                newState.maxValue = next.maxValue;
            }

            switch (currentType) {
                case 'color':
                    newState.colorRange = _chromaJs2.default.scale(colors.slice().reverse()).colors(101);
                    break;
                case 'size':
                    newState.sizeRange = newState.maxSize - newState.minSize;
                    break;
            }

            _this.setState(newState);
        }, _this.recalculateBreaks = function () {
            var _this$props = _this.props,
                onRecalculateBreaks = _this$props.onRecalculateBreaks,
                layerId = _this$props.layerId;
            var _this$state2 = _this.state,
                breakCount = _this$state2.breakCount,
                classification = _this$state2.classification,
                colors = _this$state2.colors,
                shapes = _this$state2.shapes,
                minSize = _this$state2.minSize,
                maxSize = _this$state2.maxSize,
                currentType = _this$state2.currentType,
                originalType = _this$state2.originalType,
                field = _this$state2.field;

            var customRenderer = {
                field: field,
                dynamicBreaks: {
                    classification: classification,
                    breakCount: breakCount
                }
            };

            switch (currentType) {
                case 'color':
                    customRenderer.dynamicBreaks.colors = colors;
                    break;
                case 'size':
                    customRenderer.dynamicBreaks.minSize = minSize;
                    customRenderer.dynamicBreaks.maxSize = maxSize;
                    break;
                case 'shape':
                    customRenderer.dynamicBreaks.shapes = shapes;
                    break;
            }

            onRecalculateBreaks({ layerId: layerId, type: currentType, originalType: originalType, customRenderer: customRenderer });
        }, _this.handleClassificationChange = function (value) {
            if (value !== 'Custom') {
                _this.setState({
                    classification: value
                }, _this.recalculateBreaks);
            }
        }, _this.handleFieldChange = function (field) {
            _this.setState({ field: field }, _this.recalculateBreaks);
        }, _this.handleTypeChange = function (value) {
            _this.setState({
                currentType: value
            }, _this.recalculateBreaks);
        }, _this.handleLabelChange = function (config, e) {
            config.label = e.target.value;
            config.editing = false;
            _this.setState({
                sliderValues: _this.state.sliderValues,
                sliderDisabled: false
            });
        }, _this.handleLegendTitleChange = function (e) {
            _this.setState({
                editingLegendTitle: false,
                legendTitle: e.target.value
            });
        }, _this.onEditLabel = function (config) {
            config.editing = true;
            _this.setState({
                sliderValues: _this.state.sliderValues,
                sliderDisabled: true
            });
        }, _this.renderColorPalettes = function () {

            var defaultPalettes = [['#b23d2c', '#f2c84b'], ['#70cf97', '#f1ca4d'], ['#074ba3', '#55cbf2'], ['#b23d2d', '#efc94d', '#2aaf60'], ['#2eb060', '#f1c64b', '#b23d2d'], ['#2d9dd8', '#46b25d', '#e9c84d', '#d71512'], ['#d91a14', '#f2c44a', '#48b35d', '#2d9ed7'], ['#194973', '#f0c84c']];

            return _react2.default.createElement(
                'div',
                { style: { height: 250 }, className: _this.class('palette-container') },
                defaultPalettes.map(function (palette, index) {
                    return _react2.default.createElement('div', {
                        key: index,
                        onClick: function onClick() {
                            return _this.setState({ paletteIndex: index, colors: palette, colorRange: _chromaJs2.default.scale(palette.slice().reverse()).colors(101) }, _this.updateColors);
                        },
                        className: _this.class('palette', _this.state.paletteIndex === index ? 'selected' : ''),
                        style: { background: 'linear-gradient(' + palette.join(',') + ')' }
                    });
                })
            );
        }, _this.updateColors = function () {
            var _this$state3 = _this.state,
                sliderValues = _this$state3.sliderValues,
                minValue = _this$state3.minValue,
                maxValue = _this$state3.maxValue,
                colorRange = _this$state3.colorRange;

            var referenceRange = maxValue - minValue;

            sliderValues.forEach(function (config, index) {
                var value = config.maxValue;
                var referenceValue = Math.round((value - minValue) / referenceRange * 100);
                sliderValues[index].color = colorRange[referenceValue];
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    CustomizeRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.normalize(nextProps);
    };

    CustomizeRenderer.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;

        var _props = this.props,
            layerId = _props.layerId,
            customizeLayer = _props.customizeLayer,
            type = _props.type,
            layers = _props.layers,
            metaData = _props.metaData;

        var renderer = customizeLayer[layerId];
        var layerRenderer = customizeLayer[layerId][type];

        var _state = this.state,
            colors = _state.colors,
            minSize = _state.minSize,
            maxSize = _state.maxSize,
            shapes = _state.shapes,
            breakCount = _state.breakCount,
            classification = _state.classification,
            defaultSize = _state.defaultSize,
            defaultColor = _state.defaultColor,
            defaultShape = _state.defaultShape;
        var dynamicBreaks = layerRenderer.dynamicBreaks,
            field = layerRenderer.field,
            legendTitle = layerRenderer.legendTitle;

        var newState = {
            currentType: type,
            originalType: type,
            field: field,
            defaultSize: renderer.default && renderer.default.size || defaultSize,
            defaultShape: renderer.default && renderer.default.shape || defaultShape,
            defaultColor: renderer.default && renderer.default.color || defaultColor,
            legendTitle: legendTitle || this.state.legendTitle
        };

        var enrichedSource = layers[layerId].enrichedSource;

        if (enrichedSource !== undefined && metaData[enrichedSource]) {
            newState.metaData = metaData[enrichedSource];
        }

        if (dynamicBreaks) {
            newState.breakCount = dynamicBreaks.breakCount || breakCount;
            newState.colors = dynamicBreaks.colors || colors;
            newState.minSize = dynamicBreaks.minSize || minSize;
            newState.maxSize = dynamicBreaks.maxSize || maxSize;
            newState.shapes = dynamicBreaks.shapes || shapes;
            newState.classification = dynamicBreaks.classification || classification;
        }

        this.setState(newState, function () {
            return _this2.normalize(_this2.props);
        });
    };

    CustomizeRenderer.prototype.render = function render() {
        var _this3 = this;

        var _state2 = this.state,
            minValue = _state2.minValue,
            maxValue = _state2.maxValue,
            classification = _state2.classification,
            breakCount = _state2.breakCount,
            sliderValues = _state2.sliderValues,
            isUniqueValues = _state2.isUniqueValues,
            legendTitle = _state2.legendTitle,
            colors = _state2.colors,
            colorRange = _state2.colorRange,
            minSize = _state2.minSize,
            maxSize = _state2.maxSize,
            sizeRange = _state2.sizeRange,
            currentType = _state2.currentType,
            field = _state2.field,
            originalType = _state2.originalType,
            metaData = _state2.metaData,
            defaultSize = _state2.defaultSize,
            defaultShape = _state2.defaultShape,
            defaultColor = _state2.defaultColor,
            shapes = _state2.shapes,
            editingLegendTitle = _state2.editingLegendTitle,
            paletteIndex = _state2.paletteIndex;
        var _props2 = this.props,
            applyCustomRenderer = _props2.applyCustomRenderer,
            layerId = _props2.layerId,
            onClose = _props2.onClose,
            customizeLayer = _props2.customizeLayer;


        var values = [];

        var railStyle = {
            width: 30
        };

        var trackStyles = [];

        switch (currentType) {
            case 'color':
                railStyle.background = 'linear-gradient(' + colors.join(',') + ')';
                break;
            default:
                railStyle.background = 'linear-gradient(#b7b2b2, #f0f0f0)';
        }

        if (!isUniqueValues) {
            sliderValues.forEach(function (config) {
                values.push(config.maxValue);
                trackStyles.push({
                    backgroundColor: 'transparent',
                    width: railStyle.width
                });
            });
        }

        var referenceRange = maxValue - minValue;

        var addBreak = function addBreak() {
            var highest = sliderValues[sliderValues.length - 1];
            var secondHighest = sliderValues[sliderValues.length - 2];
            var newValue = (highest.maxValue - secondHighest.maxValue) / 2 + secondHighest.maxValue;
            var referenceValue = Math.round((newValue - minValue) / referenceRange * 100);

            var newBreak = {
                minValue: secondHighest.maxValue,
                maxValue: newValue
            };

            switch (currentType) {
                case 'color':
                    newBreak.color = colorRange[referenceValue];
                    break;
                case 'size':
                    newBreak.size = secondHighest.size;
                    break;
            }

            highest.minValue = newValue;
            sliderValues.splice(sliderValues.length - 2, 0, newBreak);
            _this3.setState({
                sliderValues: sliderValues,
                breakCount: breakCount + 1,
                classification: 'Custom'
            });
        };

        var removeBreak = function removeBreak(index) {
            if (index === 0 && !isUniqueValues) {
                sliderValues[1].minValue = minValue;
            }

            sliderValues.splice(index, 1);
            _this3.setState({
                sliderValues: sliderValues,
                breakCount: isUniqueValues ? breakCount : breakCount - 1,
                classification: 'Custom'
            });
        };

        var renderShapeSelector = function renderShapeSelector(shape, onChange) {
            var shapes = ['circle', 'square', 'diamond', 'star', 'school', 'cross', 'x'];
            return _react2.default.createElement(
                'div',
                { style: { display: 'flex' } },
                shapes.map(function (shapeName) {
                    return _react2.default.createElement(
                        'div',
                        {
                            key: shapeName,
                            onClick: function onClick() {
                                return onChange(shapeName);
                            },
                            className: _this3.class('symbol-container'),
                            style: {
                                width: 24,
                                height: 24,
                                marginLeft: 10,
                                marginRight: 10,
                                padding: 2,
                                border: shapeName === shape && 'dashed 1px #154673'
                            }
                        },
                        _UIHelper2.default.getLegendSymbol({ shape: shapeName }, _this3.class('symbol'))
                    );
                })
            );
        };

        var renderSizeSlider = function renderSizeSlider(size, onChange) {
            return _react2.default.createElement(
                'div',
                { style: { width: 100 } },
                _react2.default.createElement(_rcSlider2.default, {
                    value: size,
                    railStyle: { backgroundColor: '#acb0b1' },
                    trackStyle: { backgroundColor: '#607176' },
                    handleStyle: { border: 'solid 2px #3c474a' },
                    onChange: onChange,
                    min: minSize,
                    max: maxSize
                })
            );
        };

        var handle = function handle(props) {
            var value = props.value,
                offset = props.offset,
                index = props.index;

            var referenceValue = Math.round((value - minValue) / referenceRange * 100);

            var label = void 0;
            var config = sliderValues[index];

            if (index === 0) {
                label = 'Less than ' + value;
            } else {
                label = config.minValue + ' - ' + value;
            }

            label = config.label || label;

            var tooltip = void 0,
                floatingContent = void 0;

            switch (currentType) {
                case 'color':
                    tooltip = _react2.default.createElement(
                        'div',
                        { className: _this3.class('tooltip'), style: { backgroundColor: colorRange[referenceValue] } },
                        _react2.default.createElement(
                            'span',
                            null,
                            value
                        )
                    );
                    break;
                case 'size':
                    var onSizeChange = function onSizeChange(value) {
                        config.size = value;
                        _this3.setState({ sliderValues: sliderValues });
                    };
                    var sizeFloating = renderSizeSlider(config.size, onSizeChange);
                    floatingContent = _react2.default.createElement(
                        'span',
                        { className: _this3.class('size-floating') },
                        _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SIZE'), content: sizeFloating, trigger: 'hover' },
                            _react2.default.createElement(
                                'div',
                                { className: _this3.class('info') },
                                Math.round(config.size)
                            )
                        )
                    );
                    tooltip = _react2.default.createElement(
                        'div',
                        { className: _this3.class('tooltip') },
                        _react2.default.createElement(
                            'span',
                            null,
                            value
                        )
                    );
                    break;
                case 'shape':
                    var shapeFloating = renderShapeSelector(config.shape, function (shape) {
                        config.shape = shape;
                        _this3.setState({ sliderValues: sliderValues });
                    });
                    floatingContent = _react2.default.createElement(
                        'span',
                        { className: _this3.class('shape-floating') },
                        _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SHAPE'), content: shapeFloating, trigger: 'hover' },
                            _react2.default.createElement(
                                'div',
                                { style: { width: 26 } },
                                _UIHelper2.default.getLegendSymbol(Object.assign({}, config, { color: undefined }), _this3.class('symbol'))
                            )
                        )
                    );
                    tooltip = _react2.default.createElement(
                        'div',
                        { className: _this3.class('tooltip') },
                        _react2.default.createElement(
                            'span',
                            null,
                            value
                        )
                    );
                    break;
            }

            return _react2.default.createElement(
                'div',
                {
                    className: _this3.class('option'),
                    style: { bottom: offset + '%' },
                    key: index
                },
                floatingContent,
                tooltip,
                _react2.default.createElement(
                    'div',
                    { className: _this3.class('label') },
                    config.editing ? _react2.default.createElement(_antd.Input, { defaultValue: label, onPressEnter: function onPressEnter(e) {
                            return _this3.handleLabelChange(config, e);
                        } }) : label
                ),
                _react2.default.createElement(
                    'div',
                    { className: _this3.class('default-actions') },
                    config.editing ? null : _react2.default.createElement(_antd.Button, { icon: 'edit', size: 'small', onClick: function onClick() {
                            return _this3.onEditLabel(config);
                        } }),
                    sliderValues.length > 2 ? _react2.default.createElement(_antd.Button, { icon: 'delete', size: 'small', onClick: function onClick() {
                            return removeBreak(index);
                        } }) : null
                )
            );
        };

        var handleOnChange = function handleOnChange(values) {
            values.forEach(function (value, index) {
                var referenceValue = Math.round((value - minValue) / referenceRange * 100);
                sliderValues[index].maxValue = value;
                sliderValues[index].color = colorRange[referenceValue];
                if (index !== values.length - 1) {
                    sliderValues[index + 1].minValue = value;
                }
            });
            _this3.setState({
                sliderValues: sliderValues,
                classification: 'Custom'
            });
        };

        var renderUniqueValues = function renderUniqueValues() {
            var uniqueValuesElements = [];

            sliderValues.forEach(function (uniqueValue, index) {

                var info = void 0,
                    content = void 0;
                switch (currentType) {
                    case 'color':
                        var onChangeComplete = function onChangeComplete(color) {
                            uniqueValue.color = color.hex;
                            _this3.setState({
                                sliderValues: sliderValues
                            });
                        };
                        content = _react2.default.createElement(_reactColor.ChromePicker, { color: uniqueValue.color, disableAlpha: true, onChangeComplete: onChangeComplete });
                        info = _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.COLOR'), content: content, trigger: 'hover' },
                            _react2.default.createElement('div', { className: _this3.class('info'), style: { backgroundColor: uniqueValue.color } })
                        );
                        break;
                    case 'shape':
                        content = renderShapeSelector(uniqueValue.shape, function (shape) {
                            uniqueValue.shape = shape;
                            _this3.setState({ sliderValues: sliderValues });
                        });
                        info = _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SHAPE'), content: content, trigger: 'hover' },
                            _react2.default.createElement(
                                'div',
                                { className: _this3.class('info') },
                                _UIHelper2.default.getLegendSymbol({ shape: uniqueValue.shape }, _this3.class('symbol'))
                            )
                        );
                        break;
                    case 'size':
                        content = renderSizeSlider(uniqueValue.size, function (value) {
                            uniqueValue.size = value;
                            _this3.setState({ sliderValues: sliderValues });
                        });
                        info = _react2.default.createElement(
                            _antd.Popover,
                            { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SIZE'), content: content, trigger: 'hover' },
                            _react2.default.createElement(
                                'div',
                                { className: _this3.class('info', 'size') },
                                Math.round(uniqueValue.size)
                            )
                        );
                }

                var label = uniqueValue.label || uniqueValue.value;

                uniqueValuesElements.push(_react2.default.createElement(
                    'div',
                    { className: _this3.class('unique-value'), key: uniqueValue.value },
                    info,
                    _react2.default.createElement(
                        'div',
                        { className: _this3.class('label') },
                        uniqueValue.editing ? _react2.default.createElement(_antd.Input, { defaultValue: label, onPressEnter: function onPressEnter(e) {
                                return _this3.handleLabelChange(uniqueValue, e);
                            } }) : label
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _this3.class('default-actions') },
                        uniqueValue.editing ? null : _react2.default.createElement(_antd.Button, { icon: 'edit', size: 'small', onClick: function onClick() {
                                return _this3.onEditLabel(uniqueValue);
                            } }),
                        _react2.default.createElement(_antd.Button, { icon: 'delete', size: 'small', onClick: function onClick() {
                                return removeBreak(index);
                            } })
                    )
                ));
            });

            return _react2.default.createElement(
                'div',
                { className: _this3.class('unique-values') },
                uniqueValuesElements
            );
        };

        var onApplyChanges = function onApplyChanges() {
            var _state3 = _this3.state,
                classification = _state3.classification,
                breakCount = _state3.breakCount,
                field = _state3.field,
                legendTitle = _state3.legendTitle,
                colors = _state3.colors;
            var _customizeLayer$layer = customizeLayer[layerId],
                size = _customizeLayer$layer.size,
                shape = _customizeLayer$layer.shape,
                color = _customizeLayer$layer.color;


            var defaultRenderer = void 0;

            var showSizeInfo = void 0;
            var showShapeInfo = void 0;
            var showColorInfo = void 0;

            if (currentType !== originalType) {
                showColorInfo = originalType === 'color' || !color;
                showShapeInfo = originalType === 'shape' || !shape;
                showSizeInfo = originalType === 'size' || !size;
            } else {
                showSizeInfo = !size && currentType !== 'size';
                showShapeInfo = !shape && currentType !== 'shape';
                showColorInfo = !color && currentType !== 'color';
            }

            if (showSizeInfo) {
                defaultRenderer = defaultRenderer || {};
                defaultRenderer.size = defaultSize;
            }
            if (showShapeInfo) {
                defaultRenderer = defaultRenderer || {};
                defaultRenderer.shape = defaultShape;
            }
            if (showColorInfo) {
                defaultRenderer = defaultRenderer || {};
                defaultRenderer.color = defaultColor;
            }

            onClose();

            var dynamicBreaks = {
                classification: classification,
                breakCount: breakCount
            };

            sliderValues.forEach(function (config) {
                delete config.editing;
                if (currentType !== 'color') {
                    delete config.color;
                }
                if (currentType !== 'shape') {
                    delete config.shape;
                }
                if (currentType !== 'size') {
                    delete config.size;
                }
            });

            switch (currentType) {
                case 'color':
                    dynamicBreaks.colors = colors;
                    break;
                case 'size':
                    dynamicBreaks.minSize = minSize;
                    dynamicBreaks.maxSize = maxSize;
                    break;
                case 'shape':
                    dynamicBreaks.shapes = shapes;
                    break;
            }

            applyCustomRenderer({
                layerId: layerId,
                type: currentType,
                originalType: originalType,
                customRenderer: {
                    legendTitle: legendTitle,
                    field: field,
                    dynamicBreaks: dynamicBreaks,
                    custom: sliderValues
                },
                defaultRenderer: defaultRenderer
            });
        };

        var renderDefaultOptions = function renderDefaultOptions() {
            var _customizeLayer$layer2 = customizeLayer[layerId],
                size = _customizeLayer$layer2.size,
                shape = _customizeLayer$layer2.shape,
                color = _customizeLayer$layer2.color;

            var colorInfo = void 0,
                sizeInfo = void 0,
                shapeInfo = void 0;

            var showSizeInfo = void 0;
            var showShapeInfo = void 0;
            var showColorInfo = void 0;

            if (currentType !== originalType) {
                showColorInfo = originalType === 'color' || !color;
                showShapeInfo = originalType === 'shape' || !shape;
                showSizeInfo = originalType === 'size' || !size;
            } else {
                showSizeInfo = !size && currentType !== 'size';
                showShapeInfo = !shape && currentType !== 'shape';
                showColorInfo = !color && currentType !== 'color';
            }

            if (showColorInfo) {
                var onChangeComplete = function onChangeComplete(color) {
                    _this3.setState({
                        defaultColor: color.hex
                    });
                };
                var content = _react2.default.createElement(_reactColor.ChromePicker, { color: _this3.state.defaultColor, disableAlpha: true, onChangeComplete: onChangeComplete });
                colorInfo = _react2.default.createElement(
                    'div',
                    { className: _this3.class('metric-container') },
                    _react2.default.createElement(
                        'div',
                        null,
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.DEFAULT_COLOR')
                    ),
                    _react2.default.createElement(
                        _antd.Popover,
                        { placement: 'bottom', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.COLOR'), content: content, trigger: 'hover' },
                        _react2.default.createElement('div', { className: _this3.class('info'), style: { backgroundColor: _this3.state.defaultColor } })
                    )
                );
            }

            if (showSizeInfo) {
                var _content = renderSizeSlider(_this3.state.defaultSize, function (value) {
                    _this3.setState({
                        defaultSize: value
                    });
                });
                sizeInfo = _react2.default.createElement(
                    'div',
                    { className: _this3.class('metric-container') },
                    _react2.default.createElement(
                        'div',
                        null,
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.DEFAULT_SIZE')
                    ),
                    _react2.default.createElement(
                        _antd.Popover,
                        { placement: 'bottom', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SIZE'), content: _content, trigger: 'hover' },
                        _react2.default.createElement(
                            'div',
                            { className: _this3.class('info', 'size') },
                            Math.round(_this3.state.defaultSize)
                        )
                    )
                );
            }

            if (showShapeInfo) {
                var _content2 = renderShapeSelector(_this3.state.defaultShape, function (shape) {
                    _this3.setState({
                        defaultShape: shape
                    });
                });
                shapeInfo = _react2.default.createElement(
                    'div',
                    { className: _this3.class('metric-container') },
                    _react2.default.createElement(
                        'div',
                        null,
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.DEFAULT_SHAPE')
                    ),
                    _react2.default.createElement(
                        _antd.Popover,
                        { placement: 'bottom', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.SHAPE'), content: _content2, trigger: 'hover' },
                        _react2.default.createElement(
                            'div',
                            { className: _this3.class('info') },
                            _UIHelper2.default.getLegendSymbol({ shape: _this3.state.defaultShape, style: { margin: 3 } }, _this3.class('symbol'))
                        )
                    )
                );
            }

            var fieldsElements = [];

            for (var key in metaData) {
                if (metaData[key] === 'object') continue;
                var label = metaData[key] === 'string' ? ' (' + (0, _scope.translate)('CUSTOMIZE_RENDERER.TEXT_TYPE') + ')' : ' (' + (0, _scope.translate)('CUSTOMIZE_RENDERER.NUMBER_TYPE') + ')';
                fieldsElements.push(_react2.default.createElement(
                    _antd.Select.Option,
                    { value: key, key: key },
                    key + label
                ));
            }

            return _react2.default.createElement(
                'div',
                { style: { width: 230 }, className: _this3.class('default-values') },
                _react2.default.createElement(
                    'div',
                    { className: _this3.class('metric-selection') },
                    _react2.default.createElement(
                        'div',
                        { className: _this3.class('metric-header') },
                        _react2.default.createElement(
                            'span',
                            { className: _this3.class('metric-text') },
                            (0, _scope.translate)('CUSTOMIZE_RENDERER.METRIC_SELECTION')
                        ),
                        _react2.default.createElement(_antd.Button, { icon: 'close', size: 'small', onClick: function onClick() {
                                return _this3.setState({ defaultPopoverVisible: false });
                            } })
                    ),
                    _react2.default.createElement(
                        _antd.Select,
                        { value: field, onChange: _this3.handleFieldChange, className: _this3.class('field') },
                        fieldsElements
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: _this3.class('default-options') },
                    showSizeInfo && sizeInfo,
                    showColorInfo && colorInfo,
                    showShapeInfo && shapeInfo
                )
            );
        };

        return _react2.default.createElement(
            'section',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('header') },
                _react2.default.createElement(
                    'div',
                    { className: this.class('title') },
                    editingLegendTitle ? _react2.default.createElement(_antd.Input, { defaultValue: legendTitle, onPressEnter: function onPressEnter(e) {
                            return _this3.handleLegendTitleChange(e);
                        } }) : legendTitle,
                    editingLegendTitle ? null : _react2.default.createElement(_antd.Icon, { type: "edit", style: { cursor: 'pointer', marginLeft: 6 }, onClick: function onClick() {
                            return _this3.setState({ editingLegendTitle: true });
                        } })
                ),
                _react2.default.createElement(
                    'div',
                    { className: this.class('actions') },
                    _react2.default.createElement(
                        _antd.Popover,
                        { placement: 'leftTop', content: renderDefaultOptions(), trigger: 'click', visible: this.state.defaultPopoverVisible },
                        _react2.default.createElement(_antd.Button, { icon: 'setting', size: 'small', shape: 'circle', onClick: function onClick() {
                                return _this3.setState({ defaultPopoverVisible: !_this3.state.defaultPopoverVisible });
                            } })
                    ),
                    _react2.default.createElement(_antd.Button, { type: "primary", icon: 'check', size: 'small', onClick: onApplyChanges }),
                    _react2.default.createElement(_antd.Button, { icon: 'close', size: 'small', onClick: onClose })
                )
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('options') },
                _react2.default.createElement(
                    _antd.Select,
                    { value: currentType, onChange: this.handleTypeChange, className: this.class('renderer-type') },
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'color' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.COLOR')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'size' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.SIZE')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'shape' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.SHAPE')
                    )
                ),
                _react2.default.createElement(
                    _antd.Select,
                    { value: classification, onChange: this.handleClassificationChange, className: this.class('classification') },
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Unique Values' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.UNIQUE_VALUES')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Equal Intervals' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.EQUAL_INTERVALS')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Standard Deviation' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.STANDARD_DEVIATION')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Arithmetic Progression' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.ARITHMETIC_PROGRESSION')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Geometric Progression' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.GEOMETRIC_PROGRESSION')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Quantile' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.QUANTILE')
                    ),
                    _react2.default.createElement(
                        _antd.Select.Option,
                        { value: 'Jenks' },
                        (0, _scope.translate)('CUSTOMIZE_RENDERER.JENKS')
                    )
                ),
                !isUniqueValues ? _react2.default.createElement(
                    'div',
                    { className: this.class('breaks') },
                    _react2.default.createElement(_antd.Input, { addonAfter: _react2.default.createElement(_antd.Icon, { type: 'plus', onClick: addBreak }), value: breakCount })
                ) : null
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('content') },
                !isUniqueValues && currentType === 'color' && _react2.default.createElement(
                    'div',
                    { className: this.class('colors-selector') },
                    _react2.default.createElement(
                        _antd.Popover,
                        { placement: 'leftTop', title: (0, _scope.translate)('CUSTOMIZE_RENDERER.COLOR_PALETTE'), content: this.renderColorPalettes(), trigger: 'hover' },
                        _UIHelper2.default.getIcon('FormatColorFill', { style: { fill: '#fff' } })
                    )
                ),
                !isUniqueValues ? _react2.default.createElement(
                    'div',
                    { className: this.class('breaks-values') },
                    _react2.default.createElement(_rcSlider2.default.Range, {
                        railStyle: railStyle,
                        trackStyle: trackStyles,
                        vertical: true,
                        disabled: this.state.sliderDisabled,
                        onChange: handleOnChange,
                        min: minValue,
                        max: maxValue,
                        value: values,
                        handle: handle })
                ) : renderUniqueValues()
            )
        );
    };

    return CustomizeRenderer;
}(_BaseComponent3.default);

exports.default = CustomizeRenderer;
module.exports = exports['default'];