import React from 'react';
import {
    Switch,
    Button,
    Icon,
    Popover,
    Tooltip,
    Dropdown,
    Menu
} from 'antd';
import {translate} from '../../scope';
import {CircularProgress} from 'material-ui/Progress';
import update from 'immutability-helper';
import Slider from 'rc-slider';
import {SortableHandle} from 'react-sortable-hoc';

import BaseComponent from "../../_base/BaseComponent";
import UIHelper from '../../helpers/UIHelper';
import BreaksLegend from '../breaks-legend';
import SimpleLegend from '../simple-legend';
import MultipleLegend from '../multiple-legend';
import 'rc-slider/assets/index.css';

const DragHandle = SortableHandle(() => {
    return (
        <div className="cursor-move">
            <Tooltip placement="left" title={translate('LAYER.REORDER')}>
                {UIHelper.getIcon('DragVertical')}
            </Tooltip>
        </div>
    )
});

export default class LayerComponent extends BaseComponent {

    baseClass = 'layer-component';

    state = {
        measurementHeight: 40,
        selectedIndex: undefined,
        opacity: undefined,
        lastOpacitySent: undefined
    };

    updateContentHeight = () => {
        const { measurementHeight } = this.state;
        const newMeasure = this.measurementContainer.scrollHeight;
        if (measurementHeight !== newMeasure) {
            this.setState((state) => {
                return update(state, {
                    measurementHeight: {
                        $set: newMeasure
                    }
                });
            });
        }
    };

    componentWillReceiveProps(nextProps) {
        this.normalize(nextProps);
    }

    normalize = (props) => {
        const { layers, layerId } = props;
        const {
            opacity
        } = layers[layerId];


        this.checkForBuild(props);
        this.updateContentHeight();

        this.setState((state) => {
            return update(state, {
                opacity: {
                    $set: opacity
                },
                lastOpacitySent: {
                    $set: opacity
                }
            });
        });
    };

    componentDidMount() {
        this.normalize(this.props);
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.updateContentHeight();
        }, 50);
    }

    handleOpacityChange = (finished, newOpacity, layerId) => {
        const {changeLayerOpacity} = this.props;
        const {lastOpacitySent} = this.state;
        const diff = newOpacity - lastOpacitySent;
        if (diff >= 10 || diff <= -10 || finished) {
            if (lastOpacitySent !== newOpacity) {
                changeLayerOpacity(layerId, newOpacity);
                this.setState((state) => {
                    return update(state, {
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
            this.setState((state) => {
                return update(state, {
                    opacity: {
                        $set: newOpacity
                    }
                });
            });
        }

    };

    render() {

        const {
            onSwitchToggle,
            onToggleExpand,
            showLayer,
            centerAtLayer,
            removeFromWorkspace,
            layers,
            layerId,
            onAddLayerSwipe
        } = this.props;

        const {
            title,
            enabled,
            expanded,
            building,
            renderer,
            type,
            error,
            insideZoomRange,
            minZoom,
            maxZoom,
        } = layers[layerId];

        const { measurementHeight, opacity } = this.state;


        if (insideZoomRange !== undefined) {
            setTimeout(() => {
                showLayer(enabled === true ? insideZoomRange : enabled, layerId);
            }, 0);
        }

        let legend;

        if (renderer) {
            legend = this.getLegend(type, renderer);
        }

        const renderZoomRangeWarning = () => {
            return insideZoomRange === false && (
                <div className={this.class('zoom-range')} onClick={() => onAddLayerSwipe(layerId)}>
                    <span className={this.class('warning')}>Visible from Zoom {minZoom} to {maxZoom}</span>
                </div>
            )
        };

        const renderCollapsed = () => {
            return (
                <div className={this.class('content-collapsed')} style={{height: !expanded ? 'auto' : 0, opacity: !expanded ? 1 : 0}}>
                    {legend}
                </div>
            );
        };

        const renderExpanded = () => {

            return (
                <div className={this.class('content-expanded')} style={{height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0}}>

                    {error ?
                        <div className={this.class('error')}>
                            {UIHelper.getIcon('BrokenImage', {style: {width: 42, height: 42}})}
                            <span>{translate('LAYER.SOMETHING_WRONG')}</span>
                        </div>
                        :
                        <div className={this.class('content')}>
                            <div className={this.class('footer')}>
                                {legend}
                                {!legend &&
                                <span className={this.class('no-legend')}>
                                    {translate('LAYER.LEGEND_NOT_AVAILABLE')}
                                </span>
                                }
                            </div>
                            {renderZoomRangeWarning()}
                        </div>
                    }
                </div>
            );
        };

        const sliderContent = (
            <div className={this.class('slider')}>
                <Slider
                    value={opacity}
                    railStyle={{backgroundColor: '#acb0b1'}}
                    trackStyle={{backgroundColor: '#607176'}}
                    handleStyle={{border: 'solid 2px #3c474a'}}
                    onAfterChange={(value) => this.handleOpacityChange(true, value, layerId)}
                    onChange={(value) => this.handleOpacityChange(false, value, layerId)}
                />
            </div>
        );

        const iconStyle = {
            fontSize: '24px'
        };

        const onMenuItemClick = ({key}) => {
            switch (key) {
                case 'removeFromWorkspace':
                    removeFromWorkspace(layerId);
            }
        };

        const moreActionsMenu = (
            <Menu onClick={onMenuItemClick}>
                <Menu.Item key={"removeFromWorkspace"}>
                    <span>
                        <Icon type="close"/>
                            {` ${translate('LAYER.REMOVE')}`}
                        </span>
                </Menu.Item>
            </Menu>
        );

        return (

            <section className={this.class()}>
                <div className={this.class('loading')} style={{display: building ? 'flex' : 'none' }}>
                    <Icon type={"loading"} style={{color: '#154673', fontSize: 28}} />
                </div>
                <div className={this.class('header')}>
                    <DragHandle />

                    <div className={this.class('expand')} onClick={() => onToggleExpand(layerId)}>
                        <Tooltip placement="top" title={expanded ? translate('LAYER.COLLAPSE') : translate('LAYER.EXPAND')}>
                            {UIHelper.getIcon(expanded ? 'ChevronUp' : 'ChevronDown')}
                        </Tooltip>
                    </div>

                    <div className={this.class('main')}>
                        <div className={this.class('title')}>
                            <Tooltip placement="top" title={title}>
                                {title}
                            </Tooltip>
                        </div>
                        { !expanded && enabled ?
                            renderCollapsed()
                            :  null
                        }
                    </div>

                    { (enabled || expanded) ?
                        <div className={this.class('actions')}>
                            <div className={this.class('visibility-slider')}>
                                <Popover content={sliderContent} title={translate('LAYER.VISIBILITY')} trigger="hover">
                                    {UIHelper.getIcon('Opacity')}
                                </Popover>
                            </div>
                            <div className={this.class('center')} onClick={() => centerAtLayer(layerId)}>
                                <Tooltip placement="top" title={translate('LAYER.CENTER_AT')}>
                                    <Icon type={'scan'} style={iconStyle} />
                                </Tooltip>
                            </div>
                            <div className={this.class('toggle')}>
                                <Switch
                                    checked={enabled}
                                    size={"small"}
                                    onChange={() => onSwitchToggle(layerId)}
                                />
                            </div>
                            <div className={this.class('more-actions')}>
                                <Dropdown overlay={moreActionsMenu} placement="bottomRight">
                                    <Icon type="ellipsis" size={"small"} style={{cursor: 'pointer'}} />
                                </Dropdown>
                            </div>
                        </div> : null
                    }
                </div>
                <div className={this.class('content')} style={{height: measurementHeight}}>
                    <div ref={el => this.measurementContainer = el} className={this.class('measurement')}>
                        {renderExpanded()}
                    </div>
                </div>
            </section>
        )
    }


    getLegend = (type, renderer) => {

        const { layers, layerId, onCustomizeLegend } = this.props;
        const { expanded } = layers[layerId];

        switch (type) {
            case 'Breaks':
                if (renderer.breaks) {
                    return <BreaksLegend onCustomizeLegend={onCustomizeLegend} type={'breaks'} renderer={renderer} preview={!expanded} layerId={layerId} />
                }
                break;
            case 'custom':
            case 'Custom':
                if (renderer.multiple) {
                    return <MultipleLegend onCustomizeLegend={onCustomizeLegend} renderer={renderer} preview={!expanded} layerId={layerId} />
                }
                break;
            case 'Stacked Bubble':
            case 'Feature Layer':
            case 'Simple':
            default:
                if (renderer.values) {
                    return <SimpleLegend onCustomizeLegend={onCustomizeLegend} type={'simple'} renderer={renderer} preview={!expanded} layerId={layerId}/>
                }

        }

    };

    checkForBuild = (props) => {

        const { layers, layerId, buildLayer } = props;

        const {
            enabled,
            building,
            built
        } = layers[layerId];

        if (!built && enabled && !building) {
            buildLayer(layerId);
        }
    };

}