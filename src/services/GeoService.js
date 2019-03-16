import axios from 'axios';
import hash from 'object-hash';
import {geojsonToArcGIS} from '../util/arcgis-to-geojson';
import geoJsonRestructuringWorker from '../workers/geoJsonRestructuring';
import qs from 'qs';
import {store} from '../index';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const cache = {};
const results = {};

export default class GeoService {

    static query(enrichedSource) {

        const type = enrichedSource.type;
        let promise;

        const queryHash = hash(enrichedSource);
        const cachedQuery = cache[queryHash];

        if (cachedQuery) {
            promise = cachedQuery;
        } else {
            switch (type) {
                default:
                case 'ARCGIS':
                    promise = GeoService.queryArcGis(enrichedSource);
                    break;
                case 'GEOJSON':
                    promise = GeoService.queryGeoJSON(enrichedSource);
                    break;
                case 'MAPVIEWER':
                    promise = GeoService.queryMapViewer(enrichedSource);
                    break;
                case 'ELASTIC':
                    promise = GeoService.queryElasticSearch(enrichedSource);
            }

            cache[queryHash] = promise;
        }

        return new Promise((resolve, reject) => {
            promise.then(data => {
                if (!results[queryHash]) {
                    results[queryHash] = JSON.stringify(data);
                }

                const geoData = results[queryHash];

                try {
                    if (!enrichedSource.geoKeys || !enrichedSource.dataKeys || !enrichedSource.geoKeys.length || !enrichedSource.dataKeys.length || !enrichedSource.analysis) {
                        resolve(JSON.parse(geoData));
                    } else {
                        resolve(GeoService.crossData(JSON.parse(geoData), enrichedSource));
                    }
                } catch (error) {
                    reject(error);
                }
            });
            promise.catch(reject);
        });


    }

    static queryElasticSearch(enrichedSource) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: enrichedSource.url
            }).then(({data}) => {
                try {
                    if (data.error) {
                        reject(data.error);
                        return;
                    }

                    const {dataKeys} = enrichedSource;
                    const arcGisJson = GeoService.fromGeoJsonToArcGis(data._source, dataKeys);
                    resolve(arcGisJson);

                } catch (err) {
                    reject(err);
                }

            }).catch(reject);
        });
    }

    static queryMapViewer(enrichedSource) {
        return new Promise((resolve, reject) => {
            try {
                let {layer} = enrichedSource;

                if (!layer) {
                    throw new Error('To consume MapViewer, the layer configuration(into enrichedSource) has be mandatory');
                }

                if (!layer.theme) {
                    throw new Error('To consume MapViewer, the layer#theme configuration(into enrichedSource) has been mandatory');
                }

                if (!layer.datasource) {
                    throw new Error('To consume MapViewer, the layer#datasource configuration(into enrichedSource) has been mandatory');
                }

                let sql = `select * from ${layer.theme} t where 1=1`;
                let url = enrichedSource.url.replace(/\/\/([^\/]+)/, '//$1/mapviewer/dataserver/' + layer.datasource);

                axios({
                    method: 'get',
                    url: url + '?' + qs.stringify({
                        to_srid : 4326,
                        t : layer.theme
                    })
                }).then(({data}) => {
                    try {
                        const {dataKeys} = enrichedSource;
                        const arcGisJson = GeoService.fromGeoJsonToArcGis(data, dataKeys);

                        const worker = new Worker(geoJsonRestructuringWorker);

                        worker.onmessage = (message) => {
                            console.log("msg from worker: ", message.data);
                            worker.terminate();
                            resolve(message.data);
                        };

                        worker.postMessage(JSON.stringify(arcGisJson));

                    } catch (err) {
                        reject(err);
                    }

                }).catch(reject);

            } catch (error) {
                reject(error);
            }
        });
    }

    static fromGeoJsonToArcGis(data, dataKeys) {

        let ObjectIdField;
        if (dataKeys && dataKeys.length) {
            ObjectIdField = dataKeys.join(':');
        }

        const { geometry: { type } } = data.features[0];

        let geometryType;
        switch (type) {
            default:
            case 'MultiPolygon':
            case 'Polygon':
                geometryType = 'esriGeometryPolygon';
                break;
            case 'Point':
                geometryType = 'esriGeometryPoint';
                break;
        }

        const features = geojsonToArcGIS(data);
        const {attributes, geometry} = features[0];
        const fields = [];
        if (attributes) {
            for (let attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    ObjectIdField = ObjectIdField || attr;
                    fields.push({
                        name: attr,
                        type: typeof attributes[attr] === 'number' ? 'esriFieldTypeInteger' : 'esriFieldTypeString'
                    });
                }
            }
        }

        fields.push({
            name: ObjectIdField,
            type: 'esriFieldTypeOID'
        });

        let spatialReference = {
            wkid: 102100,
            latestWkid: 3857
        };

        if (geometry && geometry.spatialReference) {
            spatialReference = geometry.spatialReference;
        }

        return {
            features,
            fields,
            ObjectIdField,
            displayFieldName: ObjectIdField,
            spatialReference,
            geometryType
        };

    }

    static queryGeoJSON(enrichedSource) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: enrichedSource.url
            }).then(({data}) => {
                try {
                    if (data.error) {
                        reject(data.error);
                        return;
                    }

                    const {dataKeys} = enrichedSource;
                    const arcGisJson = GeoService.fromGeoJsonToArcGis(data, dataKeys);
                    resolve(arcGisJson);

                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        });
    }

    static queryArcGis(enrichedSource) {
        return new Promise((resolve, reject) => {

            const params = Object.assign({
                where: '1=1',
                f: 'pjson',
                outFields: '*'
            }, enrichedSource.params);

            const token = window.localStorage.getItem('brintell-esri-map-token');

            if (token) {
                params.token = token;
            }

            axios({
                method: 'post',
                url: enrichedSource.url + '/query',
                data: qs.stringify(params)
            }).then(({data}) => {
                if (data.error) {
                    if (data.error.message === 'Invalid Token') {
                        delete params.token;
                        axios({
                            method: 'post',
                            url: enrichedSource.url + '/query',
                            data: qs.stringify(params)
                        }).then(({data}) => {
                            resolve(data);
                        }).catch(reject);
                    } else {
                        reject(data.error);
                    }
                } else {
                    resolve(data);
                }
            }).catch(reject);
        });
    }

    static crossData(geoData, enrichedSource) {
        const rawData = store.getState().data;
        const data = rawData[enrichedSource.id];

        if (!data) throw new Error('Data has not loaded yet');

        const { features } = geoData;
        const { geoKeys, dataKeys } = enrichedSource;
        const dataKey = dataKeys.join(':');

        const mappedFeatures = {};
        const crossedFeatures = [];

        features.forEach((feature) => {
            const { attributes } = feature;
            const keys = [];
            geoKeys.forEach((key) => {
                keys.push(attributes[key]);
            });
            const uniqueKey = keys.join(':');
            mappedFeatures[uniqueKey] = feature;
        });

        data.forEach((row) => {
            const keys = [];
            dataKeys.forEach((key) => {
                keys.push(row[key]);
            });
            const uniqueKey = keys.join(':');
            row[dataKey] = uniqueKey;
            const currentFeature = mappedFeatures[uniqueKey];
            if (currentFeature) {
                row.__geo = Object.assign({}, currentFeature.attributes);
                currentFeature.attributes = row;
                crossedFeatures.push(currentFeature);
            } else {
                console.warn('This data row did not match any feature: ', row);
            }
        });

        geoData.objectIdField = dataKey;
        geoData.features = crossedFeatures;
        return geoData;
    }

}