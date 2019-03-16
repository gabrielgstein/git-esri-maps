import React from 'react';
import BaseComponent from "../../_base/BaseComponent";
import {translate} from '../../scope';

export default class MeasurementModule extends BaseComponent {

    baseClass = 'measurement-widget';

    render() {

        return (
            <div className={this.class()}>
                <div>
                    <div id="measurement-widget" />
                </div>
            </div>
        )

    }

}