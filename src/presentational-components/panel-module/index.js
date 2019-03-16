import React from 'react';
import BaseComponent from "../../_base/BaseComponent";
import * as MaterialIcons from 'material-ui-icons';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import {translate} from '../../scope';

export default class PanelModule extends BaseComponent {

    baseClass = 'panel-module';

    static propTypes = {
        title: PropTypes.string,
        content: PropTypes.any,
        icon: PropTypes.string,
        currentModule: PropTypes.bool,
        ModuleClass: PropTypes.any
    };

    render() {

        const {title, actions, currentModule, ModuleClass} = this.props;

        return (

            <section className={this.class()} style={{display: currentModule ? 'flex' : 'none'}}>

                <header className={this.class('header')}>

                    <div className={this.class('title')}>
                        {translate(title)}
                    </div>

                    <div className={this.class('expander')}>
                        {
                            actions &&
                            actions.map((action, index) => {
                                const IconClass = MaterialIcons[action.icon];
                                return (
                                <IconButton key={index} aria-label="">
                                    <IconClass/>
                                </IconButton>
                                );
                            })
                        }

                    </div>

                </header>
                <div className={this.class('content')}>
                    {
                        ModuleClass && <ModuleClass />
                    }
                </div>


            </section>

        )

    }

}
