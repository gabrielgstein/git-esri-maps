import React, {Component} from 'react';
import {render} from 'react-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createMuiTheme } from 'material-ui/';

const theme = createMuiTheme({
    bgWhite: "#fff"
});

injectTapEventPlugin();

import Example from '../../src';

var demo = document.querySelector('#demo');
document.body.style.height = '100%';
document.body.style.margin = 0;
const html = document.querySelector('html');
html.style.height = '100%';
html.style.margin = 0;
demo.style.height = '100%';

const config = {
    layers: [
        {
            title: 'LAUSD Custom Layers',
            enabled: true,
            layersInstances: [
                {
                    enrichedSource: 7,
                    title: 'Projects',
                    type: 'Breaks',
                    renderer: {
                        field: 'PROJETOS',
                        prefix: '',
                        suffix: '',
                        metricLabel: 'projects',
                        dynamicBreaks: {
                            classification: 'Arithmetic Progression',
                            breakCount: 4,
                            opacity: 0.5,
                            colors: ['green', 'yellow', 'red'],
                        }
                    }
                },
                {
                    enrichedSource: 7,
                    title: 'Income',
                    type: 'Breaks',
                    renderer: {
                        field: 'RENDA',
                        prefix: '$ ',
                        suffix: '',
                        metricLabel: 'per year',
                        dynamicBreaks: {
                            classification: 'Equal Intervals',
                            breakCount: 3,
                            opacity: 0.5,
                            colors: ['blue', 'purple'],
                            precision: 2
                        }
                    }
                },
                {
                    enrichedSource: 9,
                    title: 'GEOJSON',
                    type: 'Breaks',
                    renderer: {
                        field: 'diss_me',
                        metricLabel: 'id range',
                        dynamicBreaks: {
                            classification: 'Equal Intervals',
                            breakCount: 4,
                            opacity: 0.6,
                            colors: ['yellow', 'green'],
                            precision: 0,
                        }
                    }
                },
                {
                    enrichedSource: 10,
                    title: 'GEOJSON POINT',
                    type: 'Breaks',
                    promptConfig: [
                        {
                            prompt: 'Test 1',
                            metric: 'name'
                        }
                    ],
                    renderer: {
                        field: 'pop_max',
                        metricLabel: 'max pop.',
                        dynamicBreaks: {
                            classification: 'Equal Intervals',
                            breakCount: 4,
                            opacity: 1,
                            colors: ['blue', 'yellow'],
                            precision: 0,
                            minSize: 30,
                            maxSize: 60
                        }
                    },
                    popup: {
                        title: [
                            {
                                prefix: " - ",
                                metric: "name",
                                suffix: " - "
                            }
                        ],
                        image: {
                            url: "https://cdn.pixabay.com/photo/2016/12/08/21/21/skyscraper-1893201_960_720.jpg",
                            metric: ""
                        },
                        metrics: [
                            {
                                label: [
                                    {
                                        prefix: "State: ",
                                        metric: "",
                                        suffix: ""
                                    }
                                ],
                                value: [
                                    {
                                        prefix: "",
                                        metric: "adm1name",
                                        suffix: ""
                                    }
                                ]
                            },
                            {
                                label: [
                                    {
                                        prefix: "Country: ",
                                        metric: "",
                                        suffix: ""
                                    }
                                ],
                                value: [
                                    {
                                        prefix: "",
                                        metric: "sov0name",
                                        suffix: ""
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            currentInstance: 3,
            expanded: true
        },
        {
            title: 'LAUSD Feature Layers',
            enabled: false,
            layersInstances: [
                {
                    enrichedSource: 0,
                    title: 'Schools (LAUSD)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 1,
                    title: 'Schools (Thomas Bros. Maps)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 2,
                    title: 'School Campuses (LAUSD)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 3,
                    title: 'LAUSD Boundaries',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 4,
                    title: 'LAUSD Attendance Boundary (Elementary Schools)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 5,
                    title: 'LAUSD Attendance Boundary (Middle Schools)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 6,
                    title: 'LAUSD Attendance Boundary (High Schools)',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 7,
                    title: 'LAUSD Board of Education Districts',
                    type: 'Feature Layer',
                    renderer: {}
                },
                {
                    enrichedSource: 8,
                    title: 'LAUSD Local Districts',
                    type: 'Feature Layer',
                    renderer: {}
                }
            ],
            currentInstance: 0,
            expanded: false
        }
    ],
    enrichedSources: [
        {
            id: 7,
            title: 'Camada XPTO',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/7',
            geoKeys: ['DISTRICT'],
            dataKeys: ['DISTRITO']
        },
        {
            id: 0,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/0',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 1,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/1',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 2,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/2',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 3,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/3',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 4,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/4',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 5,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/5',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 6,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/6',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 8,
            title: 'Camada Eta',
            type: "ARCGIS",
            analysis: {},
            url: 'https://maps.lacity.org/lahub/rest/services/LAUSD_Schools/MapServer/8',
            geoKeys: ['ID'],
            dataKeys: ['']
        },
        {
            id: 9,
            title: 'Camada Eta',
            type: "GEOJSON",
            url: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
            dataKeys: ['diss_me']
        },
        {
            id: 10,
            title: 'Camada Eta',
            type: "GEOJSON",
            url: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson',
            dataKeys: ['name']
        }
    ]
};

const data = [
    {
        DISTRITO: 1,
        PROJETOS: 2350,
        RENDA: 12310,
        ESTADO: 3518
    },
    {
        DISTRITO: 2,
        PROJETOS: 7550,
        RENDA: 31230,
        ESTADO: 3519
    },
    {
        DISTRITO: 3,
        PROJETOS: 4460,
        RENDA: 23230,
        ESTADO: 3520
    },
    {
        DISTRITO: 4,
        PROJETOS: 3460,
        RENDA: 63440,
        ESTADO: 3521
    },
    {
        DISTRITO: 5,
        PROJETOS: 4530,
        RENDA: 32530,
        ESTADO: 3522
    },
    {
        DISTRITO: 6,
        PROJETOS: 6550,
        RENDA: 24230,
        ESTADO: 3523
    },
    {
        DISTRITO: 7,
        PROJETOS: 4530,
        RENDA: 63560,
        ESTADO: 3524
    }
];

class Demo extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{height: '100%'}}>
                    <Example config={config} data={data} />
                </div>
            </MuiThemeProvider>
        )
    }
}

render(<Demo/>, demo);
