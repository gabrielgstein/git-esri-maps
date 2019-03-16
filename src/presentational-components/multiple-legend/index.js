import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import BaseComponent from "../../_base/BaseComponent";
import BreaksLegend from '../breaks-legend';
import SimpleLegend from '../simple-legend';
import {translate} from '../../scope';

export default class MultipleLegendComponent extends BaseComponent {

    baseClass = 'multiple-legend';

    static propTypes = {

    };


    render() {

        const { preview, renderer, layerId, onCustomizeLegend } = this.props;
        const { multiple, size, color, shape} = renderer;
        const legends = [];
        const previewLegends = [];

        if (color) {
            const first = multiple.colors[0] || {};
            let isUniqueValues = first.value !== undefined;
            legends.push(
                <BreaksLegend onCustomizeLegend={onCustomizeLegend} layerId={layerId} key="colors" type={'color'} renderer={Object.assign({}, color, {[isUniqueValues ? 'values' : 'breaks']: multiple.colors})} preview={preview} />
            );
            previewLegends.push(legends[legends.length - 1]);
        }

        if (size) {
            const first = multiple.size[0] || {};
            let isUniqueValues = first.value !== undefined;
            legends.push(
                <BreaksLegend onCustomizeLegend={onCustomizeLegend} layerId={layerId} key="size" type={'size'} renderer={Object.assign({}, size, {[isUniqueValues ? 'values' : 'breaks']: multiple.size})} />
            );
        }

        if (shape) {
            legends.push(
                <BreaksLegend onCustomizeLegend={onCustomizeLegend} layerId={layerId} key="shapes" type={'shape'} renderer={Object.assign({}, shape, {values: multiple.shapes})} preview={preview} />
            );
            previewLegends.push(legends[legends.length - 1]);
        }

        const previewLegend = () => {
            return (
                <div className={this.class('preview')}>
                    {previewLegends}
                </div>
            );
        };

        const defaultLegend = () => {
            return (
                <div className={this.class('default')}>
                    {legends}
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
