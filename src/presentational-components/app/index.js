import React from 'react';
import { dojoRequire } from 'esri-loader';
import {CircularProgress} from 'material-ui/Progress';
import getTranslator from '../../helpers/Translator';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';

import MapComponent from '../../container-components/map';
import Panel from '../../container-components/panel';
import BaseComponent from '../../_base/BaseComponent';
import EsriLoader from '../../helpers/EsriLoader';
import MODULES from '../../esri-modules';
import SCOPE from '../../scope';
import NormalizationHelper from '../../helpers/NormalizationHelper';
import './style.css';

export default class App extends BaseComponent {

    baseClass = 'bf-esri-map';

    subscription = null;

    loadESRI = () => {
        dojoRequire(MODULES.map(module => module.name), (...modules) => {
            const modulesBundle = {};
            modules.forEach((module, index) => {
                const moduleAlias = MODULES[index].alias;
                if (moduleAlias) {
                    modulesBundle[moduleAlias] = module;
                }
            });
            SCOPE.ESRI = modulesBundle;
            this.props.onMapLoaded();
        });
    };

    componentWillMount() {

        const {
            bootstrap,
            config,
            data,
            mediator,
            onDataChange,
            onFilter
        } = this.props;

        SCOPE.onFilter = onFilter;

        if (!this.subscription) {
            this.subscription = mediator.subscribe('data', (payload) => {
                onDataChange(payload);
            });
        }

        if (!config) return;

        const normalizedConfig = NormalizationHelper.configNormalizer(config);
        normalizedConfig.data = data;
        normalizedConfig.authentication = config.authentication;

        let translate;

        switch (config.language) {
            case 'en':
                translate = getTranslator('english');
                break;
            default:
            case 'pt':
                translate = getTranslator('portuguese');
                break;
        }

        SCOPE.translate = translate;

        bootstrap(
            normalizedConfig
        );

    }

    render() {

        const {
            navOpened,
            mapLoaded,
            config
        } = this.props;

        const pathToESRI = config.pathToESRI || "";

        const options = {
            url: pathToESRI + "esri/dojo/dojo.js"
        };

        const esriCSS = pathToESRI + 'esri/esri/css/esri.css';
        const calciteCSS = pathToESRI + 'esri/esri/css/calcite.css';

        return (
            <div className={this.class()}>
                <link href={esriCSS} rel='stylesheet' id="esriCSS"/>
                <link href={calciteCSS} rel='stylesheet' id="calciteCSS"/>
                <EsriLoader options={options} ready={this.loadESRI} />
                <div className={this.class('app-container')}>
                    <section className={this.class('map-section')}>
                        <div className={this.class('loading')} style={{display: !mapLoaded ? 'flex' : 'none', right: navOpened ? 450 : 0}}>
                            <CircularProgress size={80} color="primary"/>
                        </div>
                        {
                            mapLoaded && <MapComponent />
                        }
                    </section>
                    <section className={this.class('panel-section')}>
                        <div className={this.class('wrapper')} style={{right: navOpened ? 0 : -450}}>
                            <Panel />
                        </div>
                    </section>
                </div>
            </div>
        )

    }

}