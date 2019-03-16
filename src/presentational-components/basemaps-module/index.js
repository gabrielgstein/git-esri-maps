import React from 'react';
import BaseComponent from "../../_base/BaseComponent";
import images from '../../images';

export default class BasemapsModule extends BaseComponent {

    baseClass = 'basemaps-module';

    render() {

        const {
            basemapsList,
            basemap,
            changeBasemap
        } = this.props;

        const basemapsElements = [];

        basemapsList.forEach((_basemap) => {
            const {image, label, type} = _basemap;
            basemapsElements.push(
                <div
                    key={type}
                    className={this.class('basemap')}
                    onClick={() => changeBasemap(type)}
                    style={{backgroundImage: 'url(' + images[image] + ')', transform: type === basemap ? 'scale(1.05)' : ''}}>
                    <div className={this.class('title')}>
                        {label}
                    </div>
                </div>
            )
        });


        return (
            <section className={this.class()}>
                {basemapsElements}
            </section>
        )

    }

}