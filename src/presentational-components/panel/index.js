import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import {Tooltip} from 'antd';
import * as MaterialIcons from 'material-ui-icons';
import update from 'immutability-helper';
import UIHelper from '../../helpers/UIHelper';
import PanelModule from '../panel-module';
import BaseComponent from "../../_base/BaseComponent";
import {translate} from '../../scope';


export default class PanelComponent extends BaseComponent {

    baseClass = 'panel-component';

    static propTypes = {
        panels: PropTypes.array,
        currentModule: PropTypes.string,
        rulerEnabled: PropTypes.bool
    };


    render() {

        const { rulerEnabled, panels, onModuleChange, currentModule, featureInfo } = this.props;
        const {attributes} = featureInfo;

        const getPanelStyle = (panel) => {

            const defaultStyle = {
                backgroundColor: currentModule === panel.title ? '#154673' : '#b6b7b8'
            };

            const customStyle = {};

            switch (panel.title) {
                case 'PANEL.MEASUREMENT':
                    customStyle.display = rulerEnabled ? 'block' : 'none';
                    break;
                case 'PANEL.INFO_PANEL':
                    customStyle.display = attributes ? 'block' : 'none';
                    break;
                default:
            }

            return Object.assign(defaultStyle, customStyle);

        };

        return (
            <section className={this.class()}>

                <div className={this.class('icons')}>
                    {
                        panels.map((panel => {
                            const icon = UIHelper.getIcon(panel.icon);
                            return (
                                <div
                                    className={this.class(panel.bottom ? 'icon bottom' : 'icon')}
                                    style={getPanelStyle(panel)}
                                    key={panel.title}
                                >
                                    <Tooltip placement="left" title={translate(panel.title)}>
                                        <IconButton classes={{root: this.baseClass + '-module-icon'}} onClick={() => onModuleChange(panel.title)}>
                                            {icon}
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )
                        }))
                    }
                </div>

                <div className={this.class('helper-bar')} onClick={() => onModuleChange(currentModule)} />

                <div className={this.class('modules')}>

                    {
                        this.props.panels.map((panel) => {
                            return <PanelModule key={panel.title} {...panel} currentModule={this.props.currentModule === panel.title}/>
                        })
                    }

                </div>

            </section>
        )

    }

}
