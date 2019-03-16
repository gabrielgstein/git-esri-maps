import React from 'react';
import {Table, Button, Menu, Icon, Dropdown} from 'antd';
import BaseComponent from "../../_base/BaseComponent";
import FeatureHelper from "../../helpers/FeatureHelper";
import UIHelper from "../../helpers/UIHelper";
import {translate} from '../../scope';

export default class InfoModule extends BaseComponent {

    baseClass = 'info-module';

    render() {
        const {infoPanel, attributes, fields, symbolInfo, renderer} = this.props;
        const {image, title, subtitle, metrics} = infoPanel || {};

        const finalMetrics = metrics || this.generateDefaultMetrics(attributes, fields);

        if (!attributes) return null;

        const thisLayerElements = [];

        (symbolInfo || []).forEach((symbol) => {
            const {shape, color, value, minValue, maxValue} = symbol;

            if (shape && renderer.shape) {
                const {shape} = renderer;
                const {prefix, suffix, metricLabel} = shape;
                let label;
                if (value !== undefined) {
                    label = symbol.label || `${prefix ? prefix : ''}${value}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
                } else {
                    label = symbol.label || `${prefix ? prefix : ''}${minValue}${suffix ? suffix : ''} to ${prefix ? prefix : ''}${maxValue === Infinity ? 'More than' : maxValue}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
                }
                thisLayerElements.push(
                    <div className={this.class('item')} key={'shape'}>
                        {UIHelper.getLegendSymbol(symbol, this.class('symbol'))}
                        <span className={this.class('label')}>
                            {label}
                        </span>
                    </div>
                )
            }

            if (color  && renderer.color) {
                const {color} = renderer;
                const {prefix, suffix, metricLabel} = color;
                let label;
                if (value !== undefined) {
                    label = symbol.label || `${prefix ? prefix : ''}${value}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
                } else {
                    label = symbol.label || `${prefix ? prefix : ''}${minValue}${suffix ? suffix : ''} ${translate('INFO_MODULE.TO')} ${prefix ? prefix : ''}${maxValue === Infinity ? translate('INFO_MODULE.MORE_THAN') : maxValue}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
                }
                thisLayerElements.push(
                    <div className={this.class('item')} key={'color'}>
                        {UIHelper.getLegendSymbol(symbol, this.class('symbol'))}
                        <span className={this.class('label')}>
                            {label}
                        </span>
                    </div>
                )
            }

        });

        return (
            <div className={this.class()}>
                { image ?
                    <div className={this.class('image')}>
                        <img src={FeatureHelper.getMetrics(image, attributes)} alt="" />
                    </div> : null
                }


                <div className={this.class('header')}>
                    { title ?
                        <div className={this.class('title')}>
                            {FeatureHelper.getMetrics(title, attributes)}
                        </div> : null
                    }

                    { subtitle ?
                        <div className={this.class('subtitle')}>
                            {FeatureHelper.getMetrics(subtitle, attributes)}
                        </div> : null
                    }
                </div>

                <div className={this.class('feature-info')}>
                    <div className={this.class('text')}>{translate('INFO_MODULE.FROM_FEATURE')}</div>
                    {thisLayerElements}
                </div>

                <div className={this.class('feature-details')}>

                </div>

                <div className={this.class('feature-data')}>

                </div>

                <div className={this.class('text')}>{translate('INFO_MODULE.DATA')}</div>
                <div className={this.class('metrics-container')}>
                    <div className={this.class('metrics')}>
                        {this.renderMetrics(finalMetrics)}
                    </div>
                </div>

            </div>
        )
    }

    renderMetrics = (metrics) => {
        const {attributes} = this.props;

        return metrics.map((metric, index) => {

            return (
                <div className={this.class('metric')} key={index}>

                    <div className={this.class('label')}>
                        {FeatureHelper.getMetrics(metric.label, attributes)}
                    </div>

                    <div className={this.class('value')}>
                        {FeatureHelper.getMetrics(metric.value, attributes)}
                    </div>

                </div>
            )

        });

    };

    generateDefaultMetrics = (attributes, fields) => {
        const metrics = [];

        if (attributes) {

            let aliases = {};

            if (fields) {
                for (let field of fields) {
                    if (field.alias) {
                        aliases[field.name] = field.alias;
                    }
                }
            }

            for (let attr in attributes) {
                if (attributes.hasOwnProperty(attr) && attr !== '__geo') {
                    metrics.push({
                        label: [{
                            prefix: aliases[attr] || attr,
                            suffix: ': '
                        }],
                        value: [{
                            metric: attr
                        }]
                    })
                }
            }
        }

        return metrics;
    }

}