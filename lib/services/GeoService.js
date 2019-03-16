'use strict';

exports.__esModule = true;
exports.default = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _arcgisToGeojson = require('../util/arcgis-to-geojson');

var _geoJsonRestructuring = require('../workers/geoJsonRestructuring');

var _geoJsonRestructuring2 = _interopRequireDefault(_geoJsonRestructuring);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_axios2.default.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

var cache = {};
var results = {};

var GeoService = function () {
    function GeoService() {
        _classCallCheck(this, GeoService);
    }

    GeoService.query = function query(enrichedSource) {

        var type = enrichedSource.type;
        var promise = void 0;

        var queryHash = (0, _objectHash2.default)(enrichedSource);
        var cachedQuery = cache[queryHash];

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

        return new Promise(function (resolve, reject) {
            promise.then(function (data) {
                if (!results[queryHash]) {
                    results[queryHash] = JSON.stringify(data);
                }

                var geoData = results[queryHash];

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
    };

    GeoService.queryElasticSearch = function queryElasticSearch(enrichedSource) {
        return new Promise(function (resolve, reject) {
            (0, _axios2.default)({
                method: 'get',
                url: enrichedSource.url
            }).then(function (_ref) {
                var data = _ref.data;

                try {
                    if (data.error) {
                        reject(data.error);
                        return;
                    }

                    var dataKeys = enrichedSource.dataKeys;

                    var arcGisJson = GeoService.fromGeoJsonToArcGis(data._source, dataKeys);
                    resolve(arcGisJson);
                } catch (err) {
                    reject(err);
                }
            }).catch(reject);
        });
    };

    GeoService.queryMapViewer = function queryMapViewer(enrichedSource) {
        return new Promise(function (resolve, reject) {
            try {
                var layer = enrichedSource.layer;


                if (!layer) {
                    throw new Error('To consume MapViewer, the layer configuration(into enrichedSource) has be mandatory');
                }

                if (!layer.theme) {
                    throw new Error('To consume MapViewer, the layer#theme configuration(into enrichedSource) has been mandatory');
                }

                if (!layer.datasource) {
                    throw new Error('To consume MapViewer, the layer#datasource configuration(into enrichedSource) has been mandatory');
                }

                var sql = 'select * from ' + layer.theme + ' t where 1=1';
                var url = enrichedSource.url.replace(/\/\/([^\/]+)/, '//$1/mapviewer/dataserver/' + layer.datasource);

                (0, _axios2.default)({
                    method: 'get',
                    url: url + '?' + _qs2.default.stringify({
                        to_srid: 4326,
                        t: layer.theme
                    })
                }).then(function (_ref2) {
                    var data = _ref2.data;

                    try {
                        var dataKeys = enrichedSource.dataKeys;

                        var arcGisJson = GeoService.fromGeoJsonToArcGis(data, dataKeys);

                        var worker = new Worker(_geoJsonRestructuring2.default);

                        worker.onmessage = function (message) {
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
    };

    GeoService.fromGeoJsonToArcGis = function fromGeoJsonToArcGis(data, dataKeys) {

        var ObjectIdField = void 0;
        if (dataKeys && dataKeys.length) {
            ObjectIdField = dataKeys.join(':');
        }

        var type = data.features[0].geometry.type;


        var geometryType = void 0;
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

        var features = (0, _arcgisToGeojson.geojsonToArcGIS)(data);
        var _features$ = features[0],
            attributes = _features$.attributes,
            geometry = _features$.geometry;

        var fields = [];
        if (attributes) {
            for (var attr in attributes) {
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

        var spatialReference = {
            wkid: 102100,
            latestWkid: 3857
        };

        if (geometry && geometry.spatialReference) {
            spatialReference = geometry.spatialReference;
        }

        return {
            features: features,
            fields: fields,
            ObjectIdField: ObjectIdField,
            displayFieldName: ObjectIdField,
            spatialReference: spatialReference,
            geometryType: geometryType
        };
    };

    GeoService.queryGeoJSON = function queryGeoJSON(enrichedSource) {
        return new Promise(function (resolve, reject) {
            (0, _axios2.default)({
                method: 'get',
                url: enrichedSource.url
            }).then(function (_ref3) {
                var data = _ref3.data;

                try {
                    if (data.error) {
                        reject(data.error);
                        return;
                    }

                    var dataKeys = enrichedSource.dataKeys;

                    var arcGisJson = GeoService.fromGeoJsonToArcGis(data, dataKeys);
                    resolve(arcGisJson);
                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        });
    };

    GeoService.queryArcGis = function queryArcGis(enrichedSource) {
        return new Promise(function (resolve, reject) {

            var params = Object.assign({
                where: '1=1',
                f: 'pjson',
                outFields: '*'
            }, enrichedSource.params);

            var token = window.localStorage.getItem('brintell-esri-map-token');

            if (token) {
                params.token = token;
            }

            (0, _axios2.default)({
                method: 'post',
                url: enrichedSource.url + '/query',
                data: _qs2.default.stringify(params)
            }).then(function (_ref4) {
                var data = _ref4.data;

                if (data.error) {
                    if (data.error.message === 'Invalid Token') {
                        delete params.token;
                        (0, _axios2.default)({
                            method: 'post',
                            url: enrichedSource.url + '/query',
                            data: _qs2.default.stringify(params)
                        }).then(function (_ref5) {
                            var data = _ref5.data;

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
    };

    GeoService.crossData = function crossData(geoData, enrichedSource) {
        var rawData = _index.store.getState().data;
        var data = rawData[enrichedSource.id];

        if (!data) throw new Error('Data has not loaded yet');

        var features = geoData.features;
        var geoKeys = enrichedSource.geoKeys,
            dataKeys = enrichedSource.dataKeys;

        var dataKey = dataKeys.join(':');

        var mappedFeatures = {};
        var crossedFeatures = [];

        features.forEach(function (feature) {
            var attributes = feature.attributes;

            var keys = [];
            geoKeys.forEach(function (key) {
                keys.push(attributes[key]);
            });
            var uniqueKey = keys.join(':');
            mappedFeatures[uniqueKey] = feature;
        });

        data.forEach(function (row) {
            var keys = [];
            dataKeys.forEach(function (key) {
                keys.push(row[key]);
            });
            var uniqueKey = keys.join(':');
            row[dataKey] = uniqueKey;
            var currentFeature = mappedFeatures[uniqueKey];
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
    };

    return GeoService;
}();

exports.default = GeoService;
module.exports = exports['default'];