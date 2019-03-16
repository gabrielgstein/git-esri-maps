import React from "react";
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import {Radio, Tooltip} from 'antd';
import FilterCenterFocusIcon from 'material-ui-icons/FilterCenterFocus';
import Button from 'material-ui/Button';
import BaseComponent from "../../_base/BaseComponent";
import UIHelper from '../../helpers/UIHelper';
import ESRIMap from '../../classes/ESRIMap';
import Popup from '../../container-components/popup';
import FilterBar from '../../container-components/filter-bar';
import {translate} from '../../scope';

export default class MapComponent extends BaseComponent {

    baseClass = 'map-container';


    componentDidMount() {
        const { zoom, authentication, center, basemap } = this.props;

        new ESRIMap(this['mapInstance'], {
            basemap: basemap,
            center: center || [241.80, 34.05],
            zoom: zoom || 11,
            autoResize: true,
            slider: false,
            isScrollWheel: false,
        }, this.props.dispatch, this.canvas, authentication);
    };

    handleSingleFilterToggle = () => {
        const { toggleSingleFilter } = this.props;
        toggleSingleFilter();
    };

    handleFiltersToggle = () => {
        const { filterOptionsShown } = this.state;
        this.setState({filterOptionsShown: !filterOptionsShown});
    };

    handleAreaFilterToggle = () => {
        const { toggleAreaFilter } = this.props;
        toggleAreaFilter();
    };

    render() {

        const { zoomChange, toggleRuler, rulerEnabled, zoom, changeBasemap, basemap } = this.props;

        return (
            <div className={this.class()} ref={el => this.mapContainer = el}>
                <div className={this.class('top')}>
                    <div className={this.class('basemap-toggle')}>
                        <Radio.Group onChange={(e) => changeBasemap(e.target.value)} value={basemap}>
                            <Radio.Button value="gray">
                                <Tooltip placement="top" title={translate('MAP.STREETS_BASEMAP')}>
                                    {translate('MAP.STREETS')}
                                </Tooltip>
                            </Radio.Button>
                            <Radio.Button value="satellite">
                                <Tooltip placement="top" title={translate('MAP.SATELLITE_BASEMAP')}>
                                    {translate('MAP.SATELLITE')}
                                </Tooltip>
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    <FilterBar />
                </div>


                <Popup />
                <canvas style={{visibility: 'hidden', position: 'absolute'}} width="200px" height="200px" ref={el => this.canvas = el}/>
                <div className={this.class('navigation-tools')}>
                    {/*<Tooltip placement="right" title={"Measurement Tool"}>*/}
                        {/*<Button*/}
                            {/*fab*/}
                            {/*onClick={() => toggleRuler(!rulerEnabled)}*/}
                            {/*color="primary"*/}
                            {/*classes={{root: rulerEnabled ? this.baseClass + '-icon active' : this.baseClass + '-icon'}}>*/}
                            {/*{UIHelper.getIcon('Ruler')}*/}
                        {/*</Button>*/}
                    {/*</Tooltip>*/}
                    <Tooltip placement="right" title={translate('MAP.INCREASE_ZOOM')}>
                        <Button onClick={() => zoomChange(true)} fab color="primary" classes={{root: this.baseClass + '-icon'}}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip placement="right" title={translate('MAP.CURRENT_ZOOM')}>
                        <Button fab color="primary" classes={{root: this.baseClass + '-icon'}}>
                            <span>{zoom}</span>
                        </Button>
                    </Tooltip>

                    <Tooltip placement="right" title={translate('MAP.DECREASE_ZOOM')}>
                        <Button onClick={() => zoomChange(false)} fab color="primary" classes={{root: this.baseClass + '-icon'}}>
                            <RemoveIcon />
                        </Button>
                    </Tooltip>
                </div>
                <div className={this.class('map-instance', 'calcite')} ref={el => this.mapInstance = el} />
            </div>
        );
    }


}
