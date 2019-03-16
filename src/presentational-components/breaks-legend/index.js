import React from 'react';
import PropTypes from 'prop-types';
import {translate} from '../../scope';
import StringMask from 'string-mask';
import {
    Popover,
    Icon
} from 'antd';
import CustomizeRenderer from '../../container-components/customize-renderer';
import BaseComponent from "../../_base/BaseComponent";
import UIHelper from '../../helpers/UIHelper';

export default class BreaksLegendComponent extends BaseComponent {

    baseClass = 'breaks-legend';

    static propTypes = {
        breaks: PropTypes.array,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        metricLabel: PropTypes.string
    };

    state = {
        customizeVisible: false
    };

    fillZeros(count = 0) {

        let zeros = '';

        for (let c = 0; c < count; c++) {
            zeros += '0';
        }

        return zeros;

    }

    render() {

        const colors = [];
        const { preview, renderer, type, layerId, onCustomizeLegend } = this.props;
        const { breaks, values, prefix, suffix, metricLabel, thousandSeparator, decimalSeparator, dynamicBreaks, legendTitle} = renderer;
        let sizes = [];
        let hasSize;
        let style = {};
        let precision = dynamicBreaks ? dynamicBreaks.precision : 0;
        const textElements = [];
        let previewContent, defaultContent;

        const renderLabel = ({breakConfig, minValue, maxValue, value}) => {
            let maskPattern = '';

            if (thousandSeparator) {
                maskPattern += '#' + thousandSeparator + '##0';
            }

            if (decimalSeparator && maskPattern) {
                maskPattern += decimalSeparator + this.fillZeros(precision);
            } else if (decimalSeparator) {
                maskPattern += '#' + decimalSeparator + this.fillZeros(precision);
            }

            if (maskPattern) {
                if (value) {
                    value = StringMask.apply(value.toFixed(precision).replace('.', ''), maskPattern, {reverse: true});
                } else {
                    minValue = StringMask.apply(minValue.toFixed(precision).replace('.', ''), maskPattern, {reverse: true});
                    maxValue = StringMask.apply(maxValue.toFixed(precision).replace('.', ''), maskPattern, {reverse: true});
                }
            }

            if (value) {
                return breakConfig.label || `${prefix ? prefix : ''}${value}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`
            } else {
                return breakConfig.label || `${prefix ? prefix : ''}${minValue}${suffix ? suffix : ''} ${translate('BREAKS_LEGEND.TO')} ${prefix ? prefix : ''}${maxValue === Infinity ? translate('BREAKS_LEGEND.MORE_THAN') : maxValue}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
            }
        };

        if (breaks) {
            (breaks || []).forEach((breakConfig, index) => {
                let {minValue, maxValue, color, size, borderColor, borderWidth, value} = breakConfig;

                Object.assign(style, {borderColor, borderWidth});

                if (size) {
                    if (sizes.indexOf(size) === -1) {
                        sizes.push(size);
                    }
                }

                if (Array.isArray(color)) {
                    colors.push('rgba(' + color.join(',') + ')')
                } else {
                    colors.push(color || '#154673');
                }

                const label = renderLabel({breakConfig, minValue, maxValue, value});

                textElements.push(
                    <div key={index} title={label} className={this.class('label')}>
                        {label}
                    </div>
                );
            });
            hasSize = sizes.length > 1;
            style.background = 'linear-gradient(to right,' + colors.join(',') + ')';
            previewContent = (
                <div className={this.class('body')}>
                    <div
                        className={this.class('bar')}
                        style={style}
                    />
                </div>

            );
            defaultContent = (
                <div className={this.class('body')}>
                    {
                        hasSize ?
                            <div className="main">
                                <div className="outer-mask">
                                    <div className="inner-mask">
                                        <div className="content" style={style} />
                                    </div>
                                </div>
                            </div> :
                            <div className={this.class('bar')} style={style}/>
                    }
                    <div className={this.class('textual')}>
                        {textElements}
                    </div>
                </div>
            );
        } else if (values) {
            (values || []).forEach((valueConfig, index) => {
                const {value, url, minValue, maxValue} = valueConfig;
                const label = renderLabel({breakConfig: valueConfig, value, minValue, maxValue});

                textElements.push(
                    <div key={index} className={this.class('item')}>
                        { !url &&
                        UIHelper.getLegendSymbol(valueConfig, this.class('symbol'))
                        }
                        { url &&
                        <img className={this.class('image')} src={url} />
                        }
                        { !preview &&
                            <span title={label} className={this.class('label')}>
                        {label}
                    </span>
                        }
                    </div>
                );

            });
            previewContent = (
                <div className={this.class('body')}>
                    <div key={'overflow-bar'} className={this.class('overflow-bar')} />
                    {textElements}
                </div>
            );
            defaultContent = (
                <div className={this.class('body')} style={{flexWrap: 'wrap'}}>
                    {textElements}
                </div>
            );
        }

        const previewLegend = () => {
            return (
                <div className={this.class('preview')}>
                    {previewContent}
                </div>
            );
        };

        const handleVisibleChange = (visible) => {
            if (visible) {
                onCustomizeLegend(layerId, type);
                this.setState({customizeVisible: true});
            }
        };

        const defaultLegend = () => {
            style.background = 'linear-gradient(' + colors.join(',') + ')';
            return (
                <div className={this.class('default')}>
                    <div className={this.class('header')}>
                        <div className={this.class('title')}>
                            {legendTitle || translate('BREAKS_LEGEND.LEGEND')}
                        </div>

                        <span className={this.class('edit')}>
                            <Popover placement="bottomRight" visible={this.state.customizeVisible} content={this.state.customizeVisible ? <CustomizeRenderer onClose={() => this.setState({customizeVisible: false})} layerId={layerId} renderer={renderer} type={type}/> : null} trigger="click" onVisibleChange={handleVisibleChange}>
                                <Icon type={"edit"} style={{cursor: 'pointer'}} />
                            </Popover>
                        </span>
                    </div>
                    {defaultContent}
                </div>
            )
        };

        return (
            <section className={this.class()}>
                { preview ?
                    previewLegend() :
                    defaultLegend()
                }
            </section>
        )
    }

}
