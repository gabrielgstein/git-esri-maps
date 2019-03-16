import React from 'react';
import BaseComponent from "../../_base/BaseComponent";
import LayerContainer from '../../container-components/layer';
import {translate} from '../../scope';
import {
    Button
} from 'antd';
import {SortableContainer} from 'react-sortable-hoc';

const SortableLayers = SortableContainer(({layersElements}) => {
    return (
        <section className={'layers-module'}>
            {layersElements}
        </section>
    )
});

export default class LayersModule extends BaseComponent {

    baseClass = 'layers-module';

    render() {

        const {
            workspace,
            mapLoaded,
            onReorderLayer,
            onAddLayer
        } = this.props;

        const {layersOrder} = workspace;

        const layersElements = [];

        layersOrder.forEach((layerIndex, index) => {

            layersElements.push(
                <LayerContainer
                    collection="item"
                    key={layerIndex}
                    layerId={layerIndex}
                    index={index}
                />
            )
        });

        return mapLoaded &&
            <div className={this.class()}>
                <div className={this.class('actions')}>
                    <Button type={"primary"} icon="plus" onClick={onAddLayer}>
                        {translate('LAYERS_MODULE.ADD_LAYER')}
                    </Button>
                </div>
                <SortableLayers
                    layersElements={layersElements}
                    lockToContainerEdges={true}
                    lockAxis="y"
                    useDragHandle
                    helperClass="dragging"
                    onSortEnd={onReorderLayer}
                />
            </div>
            ;
    }

}