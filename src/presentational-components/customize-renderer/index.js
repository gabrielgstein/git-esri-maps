import React from 'react';
import {
    Select,
    Input,
    Icon,
    Tooltip,
    Button,
    Popover
} from 'antd';
import {translate} from '../../scope';
import {ChromePicker} from 'react-color';
import chroma from 'chroma-js';
import Slider from 'rc-slider';
import BaseComponent from "../../_base/BaseComponent";
import PropTypes from 'prop-types';
import UIHelper from "../../helpers/UIHelper";

export default class CustomizeRenderer extends BaseComponent {

    baseClass = 'customize-renderer';

    state = {
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
    };

    componentWillReceiveProps(nextProps) {
        this.normalize(nextProps);
    }

    normalize = (props) => {
        const {currentType} = this.state;
        const {layerId, customizeLayer} = props;
        const layerRenderer = customizeLayer[layerId][currentType];

        const {
            colors,
            legendTitle,
            breakCount
        } = this.state;

        const {custom} = layerRenderer;
        const firstElement = custom[0] || {};

        const isUniqueValues = (custom.length && firstElement.value) !== undefined;

        const newState = {
            sliderValues: custom,
            legendTitle: layerRenderer.legendTitle || legendTitle,
            breakCount: isUniqueValues ? breakCount : custom.length || breakCount,
            isUniqueValues
        };


        if (!isUniqueValues) {
            const first = custom[0] || {};
            const next = custom[custom.length - 1] || {};
            newState.minValue = first.minValue;
            newState.maxValue = next.maxValue;
        }

        switch (currentType) {
            case 'color':
                newState.colorRange = chroma.scale(colors.slice().reverse()).colors(101);
                break;
            case 'size':
                newState.sizeRange = newState.maxSize - newState.minSize;
                break;
        }

        this.setState(newState);
    };

    componentWillMount() {
        const {layerId, customizeLayer, type, layers, metaData} = this.props;
        const renderer = customizeLayer[layerId];
        const layerRenderer = customizeLayer[layerId][type];

        const {
            colors,
            minSize,
            maxSize,
            shapes,
            breakCount,
            classification,
            defaultSize,
            defaultColor,
            defaultShape,
        } = this.state;

        const {dynamicBreaks, field, legendTitle} = layerRenderer;
        const newState = {
            currentType: type,
            originalType: type,
            field,
            defaultSize: (renderer.default && renderer.default.size) || defaultSize,
            defaultShape: (renderer.default && renderer.default.shape) || defaultShape,
            defaultColor: (renderer.default && renderer.default.color) || defaultColor,
            legendTitle: legendTitle || this.state.legendTitle,
        };

        const {enrichedSource} = layers[layerId];
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

        this.setState(newState, () => this.normalize(this.props));
    }

    recalculateBreaks = () => {
        const {onRecalculateBreaks, layerId} = this.props;
        const {breakCount, classification, colors, shapes, minSize, maxSize, currentType, originalType, field} = this.state;
        const customRenderer = {
            field,
            dynamicBreaks: {
                classification,
                breakCount,
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

        onRecalculateBreaks({layerId, type: currentType, originalType, customRenderer});
    };

    handleClassificationChange = (value) => {
        if (value !== 'Custom') {
            this.setState({
                classification: value
            }, this.recalculateBreaks);
        }

    };

    handleFieldChange = (field) => {
        this.setState({field}, this.recalculateBreaks);
    };

    handleTypeChange = (value) => {
        this.setState({
            currentType: value
        }, this.recalculateBreaks);
    };

    handleLabelChange = (config, e) => {
        config.label = e.target.value;
        config.editing = false;
        this.setState({
            sliderValues: this.state.sliderValues,
            sliderDisabled: false
        });
    };

    handleLegendTitleChange = (e) => {
        this.setState({
            editingLegendTitle: false,
            legendTitle: e.target.value
        });
    };

    onEditLabel = (config) => {
        config.editing = true;
        this.setState({
            sliderValues: this.state.sliderValues,
            sliderDisabled: true
        });
    };

    renderColorPalettes = () => {

        const defaultPalettes = [
            ['#b23d2c', '#f2c84b'],
            ['#70cf97', '#f1ca4d'],
            ['#074ba3', '#55cbf2'],
            ['#b23d2d', '#efc94d', '#2aaf60'],
            ['#2eb060', '#f1c64b', '#b23d2d'],
            ['#2d9dd8', '#46b25d', '#e9c84d', '#d71512'],
            ['#d91a14', '#f2c44a', '#48b35d', '#2d9ed7'],
            ['#194973', '#f0c84c']
        ];

        return (
            <div style={{height: 250}} className={this.class('palette-container')}>
                {
                    defaultPalettes.map((palette, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => this.setState({paletteIndex: index, colors: palette, colorRange: chroma.scale(palette.slice().reverse()).colors(101)}, this.updateColors)}
                                className={this.class('palette', this.state.paletteIndex === index ? 'selected' : '')}
                                style={{background: 'linear-gradient(' + palette.join(',') + ')'}}
                            />
                        )
                    })
                }
            </div>
        )
    };

    updateColors = () => {
        const {sliderValues, minValue, maxValue, colorRange} = this.state;
        const referenceRange = maxValue - minValue;

        sliderValues.forEach((config, index) => {
            const value = config.maxValue;
            const referenceValue = Math.round((value - minValue) / referenceRange * 100);
            sliderValues[index].color = colorRange[referenceValue];
        });
    };

    render() {

        const {
            minValue,
            maxValue,
            classification,
            breakCount,
            sliderValues,
            isUniqueValues,
            legendTitle,
            colors,
            colorRange,
            minSize,
            maxSize,
            sizeRange,
            currentType,
            field,
            originalType,
            metaData,
            defaultSize,
            defaultShape,
            defaultColor,
            shapes,
            editingLegendTitle,
            paletteIndex
        } = this.state;

        const {
            applyCustomRenderer,
            layerId,
            onClose,
            customizeLayer
        } = this.props;

        const values = [];

        let railStyle = {
            width: 30,
        };

        const trackStyles = [];

        switch (currentType) {
            case 'color':
                railStyle.background = 'linear-gradient(' + colors.join(',') + ')';
                break;
            default:
                railStyle.background = 'linear-gradient(#b7b2b2, #f0f0f0)';
        }

        if (!isUniqueValues) {
            sliderValues.forEach((config) => {
                values.push(config.maxValue);
                trackStyles.push({
                    backgroundColor: 'transparent',
                    width: railStyle.width
                });
            });
        }

        const referenceRange = maxValue - minValue;

        const addBreak = () => {
            const highest = sliderValues[sliderValues.length - 1];
            const secondHighest = sliderValues[sliderValues.length - 2];
            const newValue = ((highest.maxValue - secondHighest.maxValue) / 2) + secondHighest.maxValue;
            const referenceValue = Math.round((newValue - minValue) / referenceRange * 100);

            const newBreak = {
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
            this.setState({
                sliderValues: sliderValues,
                breakCount: breakCount + 1,
                classification: 'Custom'
            });
        };

        const removeBreak = (index) => {
            if (index === 0 && !isUniqueValues) {
                sliderValues[1].minValue = minValue;
            }

            sliderValues.splice(index, 1);
            this.setState({
                sliderValues: sliderValues,
                breakCount: isUniqueValues ? breakCount : breakCount - 1,
                classification: 'Custom'
            });
        };

        const renderShapeSelector = (shape, onChange) => {
            const shapes = ['circle', 'square', 'diamond', 'star', 'school', 'cross', 'x'];
            return (
                <div style={{display: 'flex'}}>
                    {
                        shapes.map((shapeName) => {
                            return (
                                <div
                                    key={shapeName}
                                    onClick={() => onChange(shapeName)}
                                    className={this.class('symbol-container')}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        padding: 2,
                                        border: shapeName === shape && 'dashed 1px #154673'
                                    }}
                                >
                                    {UIHelper.getLegendSymbol({shape: shapeName}, this.class('symbol'))}
                                </div>
                            )
                        })
                    }
                </div>
            );
        };

        const renderSizeSlider = (size, onChange) => {
            return (
                <div style={{width: 100}}>
                    <Slider
                        value={size}
                        railStyle={{backgroundColor: '#acb0b1'}}
                        trackStyle={{backgroundColor: '#607176'}}
                        handleStyle={{border: 'solid 2px #3c474a'}}
                        onChange={onChange}
                        min={minSize}
                        max={maxSize}
                    />
                </div>
            );
        };

        const handle = (props) => {
            const { value, offset, index } = props;
            const referenceValue = Math.round((value - minValue) / referenceRange * 100);

            let label;
            const config = sliderValues[index];

            if (index === 0) {
                label = 'Less than ' + value;
            } else {
                label = config.minValue + ' - ' + value
            }

            label = config.label || label;

            let tooltip, floatingContent;

            switch (currentType) {
                case 'color':
                    tooltip = (
                        <div className={this.class('tooltip')} style={{backgroundColor: colorRange[referenceValue]}}>
                            <span>
                                {value}
                            </span>
                        </div>
                    );
                    break;
                case 'size':
                    const onSizeChange = (value) => {
                        config.size = value;
                        this.setState({sliderValues});
                    };
                    const sizeFloating = renderSizeSlider(config.size, onSizeChange);
                    floatingContent = (
                        <span className={this.class('size-floating')}>
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.SIZE')} content={sizeFloating} trigger="hover">
                                <div className={this.class('info')}>
                                    {Math.round(config.size)}
                                </div>
                            </Popover>
                        </span>
                    );
                    tooltip = (
                        <div className={this.class('tooltip')}>
                            <span>
                                {value}
                            </span>
                        </div>
                    );
                    break;
                case 'shape':
                    const shapeFloating = renderShapeSelector(config.shape, (shape) => {
                        config.shape = shape;
                        this.setState({sliderValues});
                    });
                    floatingContent = (
                        <span className={this.class('shape-floating')}>
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.SHAPE')} content={shapeFloating} trigger="hover">
                                <div style={{width: 26}}>
                                    {UIHelper.getLegendSymbol(Object.assign({}, config, {color: undefined}), this.class('symbol'))}
                                </div>
                            </Popover>
                        </span>
                    );
                    tooltip = (
                        <div className={this.class('tooltip')}>
                            <span>
                                {value}
                            </span>
                        </div>
                    );
                    break;
            }

            return (
                <div
                    className={this.class('option')}
                    style={{bottom: offset + '%'}}
                    key={index}
                >
                    {floatingContent}
                    {tooltip}
                    <div className={this.class('label')}>
                        {config.editing ?
                            <Input defaultValue={label} onPressEnter={(e) => this.handleLabelChange(config, e)} />
                            :
                            label
                        }
                    </div>
                    <div className={this.class('default-actions')}>
                        {config.editing ?
                            null
                            :
                            <Button icon={'edit'} size={'small'} onClick={() => this.onEditLabel(config)}/>
                        }
                        { sliderValues.length > 2 ?
                            <Button icon={'delete'} size={'small'} onClick={() => removeBreak(index)}/> : null
                        }
                    </div>
                </div>
            );
        };

        const handleOnChange = (values) => {
            values.forEach((value, index) => {
                const referenceValue = Math.round((value - minValue) / referenceRange * 100);
                sliderValues[index].maxValue = value;
                sliderValues[index].color = colorRange[referenceValue];
                if (index !== values.length - 1) {
                    sliderValues[index + 1].minValue = value;
                }
            });
            this.setState({
                sliderValues: sliderValues,
                classification: 'Custom'
            });
        };

        const renderUniqueValues = () => {
            const uniqueValuesElements = [];

            sliderValues.forEach((uniqueValue, index) => {

                let info, content;
                switch (currentType) {
                    case 'color':
                        const onChangeComplete = (color) => {
                            uniqueValue.color = color.hex;
                            this.setState({
                                sliderValues
                            });
                        };
                        content = <ChromePicker color={uniqueValue.color} disableAlpha={true} onChangeComplete={onChangeComplete} />;
                        info = (
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.COLOR')} content={content} trigger="hover">
                                <div className={this.class('info')} style={{backgroundColor: uniqueValue.color}}/>
                            </Popover>
                        );
                        break;
                    case 'shape':
                        content = renderShapeSelector(uniqueValue.shape, (shape) => {
                            uniqueValue.shape = shape;
                            this.setState({sliderValues});
                        });
                        info = (
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.SHAPE')} content={content} trigger="hover">
                                <div className={this.class('info')}>
                                    {UIHelper.getLegendSymbol({shape: uniqueValue.shape}, this.class('symbol'))}
                                </div>
                            </Popover>
                        );
                        break;
                    case 'size':
                        content = renderSizeSlider(uniqueValue.size, (value) => {
                            uniqueValue.size = value;
                            this.setState({sliderValues});
                        });
                        info = (
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.SIZE')} content={content} trigger="hover">
                                <div className={this.class('info', 'size')}>
                                    {Math.round(uniqueValue.size)}
                                </div>
                            </Popover>
                        )
                }

                const label = uniqueValue.label || uniqueValue.value;

                uniqueValuesElements.push(
                    <div className={this.class('unique-value')} key={uniqueValue.value}>
                        {info}
                        <div className={this.class('label')}>
                            {uniqueValue.editing ?
                                <Input defaultValue={label} onPressEnter={(e) => this.handleLabelChange(uniqueValue, e)} />
                                :
                                label
                            }
                        </div>
                        <div className={this.class('default-actions')}>
                            {uniqueValue.editing ?
                                null
                                :
                                <Button icon={'edit'} size={'small'} onClick={() => this.onEditLabel(uniqueValue)}/>
                            }
                            <Button icon={'delete'} size={'small'} onClick={() => removeBreak(index)}/>
                        </div>
                    </div>
                )
            });

            return (
                <div className={this.class('unique-values')}>
                    {uniqueValuesElements}
                </div>
            );
        };

        const onApplyChanges = () => {
            const {
                classification,
                breakCount,
                field,
                legendTitle,
                colors
            } = this.state;

            const {size, shape, color} = customizeLayer[layerId];

            let defaultRenderer;

            let showSizeInfo;
            let showShapeInfo;
            let showColorInfo;

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

            const dynamicBreaks = {
                classification,
                breakCount,
            };

            sliderValues.forEach(config => {
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
                layerId,
                type: currentType,
                originalType,
                customRenderer: {
                    legendTitle,
                    field: field,
                    dynamicBreaks,
                    custom: sliderValues
                },
                defaultRenderer
            });
        };

        const renderDefaultOptions = () => {

            const {size, shape, color} = customizeLayer[layerId];
            let colorInfo, sizeInfo, shapeInfo;

            let showSizeInfo;
            let showShapeInfo;
            let showColorInfo;

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
                const onChangeComplete = (color) => {
                    this.setState({
                        defaultColor: color.hex
                    });
                };
                let content = <ChromePicker color={this.state.defaultColor} disableAlpha={true} onChangeComplete={onChangeComplete} />;
                colorInfo = (
                    <div className={this.class('metric-container')}>
                        <div>
                            {translate('CUSTOMIZE_RENDERER.DEFAULT_COLOR')}
                        </div>
                        <Popover placement="bottom" title={translate('CUSTOMIZE_RENDERER.COLOR')} content={content} trigger="hover">
                            <div className={this.class('info')} style={{backgroundColor: this.state.defaultColor}}/>
                        </Popover>
                    </div>

                );
            }

            if (showSizeInfo) {
                let content = renderSizeSlider(this.state.defaultSize, (value) => {
                    this.setState({
                        defaultSize: value
                    });
                });
                sizeInfo = (
                    <div className={this.class('metric-container')}>
                        <div>
                            {translate('CUSTOMIZE_RENDERER.DEFAULT_SIZE')}
                        </div>
                        <Popover placement="bottom" title={translate('CUSTOMIZE_RENDERER.SIZE')} content={content} trigger="hover">
                            <div className={this.class('info', 'size')}>
                                {Math.round(this.state.defaultSize)}
                            </div>
                        </Popover>
                    </div>

                )
            }

            if (showShapeInfo) {
                let content = renderShapeSelector(this.state.defaultShape, (shape) => {
                    this.setState({
                        defaultShape: shape
                    });
                });
                shapeInfo = (
                    <div className={this.class('metric-container')}>
                        <div>
                            {translate('CUSTOMIZE_RENDERER.DEFAULT_SHAPE')}
                        </div>
                        <Popover placement="bottom" title={translate('CUSTOMIZE_RENDERER.SHAPE')} content={content} trigger="hover">
                            <div className={this.class('info')}>
                                {UIHelper.getLegendSymbol({shape: this.state.defaultShape, style: {margin: 3}}, this.class('symbol'))}
                            </div>
                        </Popover>
                    </div>

                );
            }

            const fieldsElements = [];

            for (let key in metaData) {
                if (metaData[key] === 'object') continue;
                const label = metaData[key] === 'string' ? ` (${translate('CUSTOMIZE_RENDERER.TEXT_TYPE')})` : ` (${translate('CUSTOMIZE_RENDERER.NUMBER_TYPE')})`;
                fieldsElements.push(
                    <Select.Option value={key} key={key}>{key + label}</Select.Option>
                )
            }

            return (
                <div style={{width: 230}} className={this.class('default-values')}>
                    <div className={this.class('metric-selection')}>
                        <div className={this.class('metric-header')}>
                            <span className={this.class('metric-text')}>{translate('CUSTOMIZE_RENDERER.METRIC_SELECTION')}</span>
                            <Button icon={'close'} size={'small'} onClick={() => this.setState({defaultPopoverVisible: false})}/>
                        </div>
                        <Select value={field} onChange={this.handleFieldChange} className={this.class('field')}>
                            {fieldsElements}
                        </Select>
                    </div>
                    <div className={this.class('default-options')}>
                        { showSizeInfo &&
                            sizeInfo
                        }
                        { showColorInfo &&
                            colorInfo
                        }
                        { showShapeInfo &&
                            shapeInfo
                        }
                    </div>

                </div>
            )
        };

        return (

            <section className={this.class()}>
                <div className={this.class('header')}>
                    <div className={this.class('title')}>
                        { editingLegendTitle ?
                            <Input defaultValue={legendTitle} onPressEnter={(e) => this.handleLegendTitleChange(e)} />
                            :
                            legendTitle
                        }
                        { editingLegendTitle ?
                            null
                            :
                            <Icon type={"edit"} style={{cursor: 'pointer', marginLeft: 6}} onClick={() => this.setState({editingLegendTitle: true})}/>
                        }
                    </div>
                    <div className={this.class(('actions'))}>
                        <Popover placement="leftTop" content={renderDefaultOptions()} trigger="click" visible={this.state.defaultPopoverVisible}>
                            <Button icon={'setting'} size={'small'} shape={'circle'} onClick={() => this.setState({defaultPopoverVisible: !this.state.defaultPopoverVisible})}/>
                        </Popover>
                        <Button type={"primary"} icon={'check'} size={'small'} onClick={onApplyChanges} />
                        <Button icon={'close'} size={'small'} onClick={onClose} />
                    </div>
                </div>
                <div className={this.class('options')}>
                    <Select value={currentType} onChange={this.handleTypeChange} className={this.class('renderer-type')}>
                        <Select.Option value="color">{translate('CUSTOMIZE_RENDERER.COLOR')}</Select.Option>
                        <Select.Option value="size">{translate('CUSTOMIZE_RENDERER.SIZE')}</Select.Option>
                        <Select.Option value="shape">{translate('CUSTOMIZE_RENDERER.SHAPE')}</Select.Option>
                    </Select>
                    <Select value={classification} onChange={this.handleClassificationChange} className={this.class('classification')}>
                        <Select.Option value="Unique Values">{translate('CUSTOMIZE_RENDERER.UNIQUE_VALUES')}</Select.Option>
                        <Select.Option value="Equal Intervals">{translate('CUSTOMIZE_RENDERER.EQUAL_INTERVALS')}</Select.Option>
                        <Select.Option value="Standard Deviation">{translate('CUSTOMIZE_RENDERER.STANDARD_DEVIATION')}</Select.Option>
                        <Select.Option value="Arithmetic Progression">{translate('CUSTOMIZE_RENDERER.ARITHMETIC_PROGRESSION')}</Select.Option>
                        <Select.Option value="Geometric Progression">{translate('CUSTOMIZE_RENDERER.GEOMETRIC_PROGRESSION')}</Select.Option>
                        <Select.Option value="Quantile">{translate('CUSTOMIZE_RENDERER.QUANTILE')}</Select.Option>
                        <Select.Option value="Jenks">{translate('CUSTOMIZE_RENDERER.JENKS')}</Select.Option>
                    </Select>
                    { !isUniqueValues ?
                        <div className={this.class('breaks')}>
                            <Input addonAfter={<Icon type="plus" onClick={addBreak} />} value={breakCount}/>
                        </div> : null
                    }
                </div>
                <div className={this.class('content')}>
                    { !isUniqueValues && currentType === 'color' &&
                        <div className={this.class('colors-selector')}>
                            <Popover placement="leftTop" title={translate('CUSTOMIZE_RENDERER.COLOR_PALETTE')} content={this.renderColorPalettes()} trigger="hover">
                                {UIHelper.getIcon('FormatColorFill', {style: {fill: '#fff'}})}
                            </Popover>
                        </div>
                    }
                    { !isUniqueValues ?
                        <div className={this.class('breaks-values')}>
                            <Slider.Range
                                railStyle={railStyle}
                                trackStyle={trackStyles}
                                vertical
                                disabled={this.state.sliderDisabled}
                                onChange={handleOnChange}
                                min={minValue}
                                max={maxValue}
                                value={values}
                                handle={handle} />
                        </div>
                        : renderUniqueValues()
                    }

                </div>
            </section>

        )

    }

}
