'use strict';

exports.__esModule = true;
exports.mapActions = exports.layersActions = exports.appActions = undefined;

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _layers = require('./layers');

var _layers2 = _interopRequireDefault(_layers);

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.appActions = _app2.default;
exports.layersActions = _layers2.default;
exports.mapActions = _map2.default;
exports.default = {
    appActions: _app2.default,
    layersActions: _layers2.default,
    mapActions: _map2.default
};