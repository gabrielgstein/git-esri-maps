import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Popover} from 'antd';
import chroma from 'chroma-js';
import BaseComponent from "../../_base/BaseComponent";
import CustomizeRenderer from '../../container-components/customize-renderer';
import UIHelper from "../../helpers/UIHelper";
import {translate} from '../../scope';

export default class SimpleLegendComponent extends BaseComponent {

    baseClass = 'simple-legend';

    state = {
        customizeVisible: false
    };

    render() {

        const { preview, type, renderer, layerId, onCustomizeLegend } = this.props;
        const {values, prefix, suffix, metricLabel, legendTitle} = renderer;
        const textElements = [];

        (values || []).forEach((valueConfig, index) => {
            const {value, url} = valueConfig;

            const label = valueConfig.label || `${prefix ? prefix : ''}${value}${suffix ? suffix : ''} ${metricLabel ? metricLabel : ''}`;
            textElements.push(
                <div key={index} className={this.class('item')}>
                    { !url &&
                    UIHelper.getLegendSymbol(valueConfig, this.class('symbol'))
                    }
                    { url &&
                    <img className={this.class('image')} src={url} />
                    }
                    { !preview &&
                    <span className={this.class('label')}>
                        {label}
                    </span>
                    }
                </div>
            );

        });

        const previewLegend = () => {
            return (
                <div className={this.class('preview')}>
                    <div className={this.class('body')}>
                        <div className={this.class('overflow-bar')} />
                        {textElements}
                    </div>
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
            return (
                <div className={this.class('default')}>
                    <div className={this.class('header')}>
                        <div className={this.class('title')}>
                            {legendTitle || translate('SIMPLE_LEGEND.LEGEND')}
                        </div>

                        <span className={this.class('edit')}>
                            <Popover placement="bottomRight" visible={this.state.customizeVisible} content={this.state.customizeVisible ? <CustomizeRenderer onClose={() => this.setState({customizeVisible: false})} layerId={layerId} renderer={renderer} type={type}/> : null} trigger="click" onVisibleChange={handleVisibleChange}>
                                <Icon type={"edit"} />
                            </Popover>
                        </span>
                    </div>
                    <div className={this.class('body')}>
                        {textElements}
                    </div>
                </div>
            );
        };

        return (
            <section className={this.class()}>
                {
                    preview ?
                        previewLegend() :
                        defaultLegend()
                }
            </section>
        )

    }

}
