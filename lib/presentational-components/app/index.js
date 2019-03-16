'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _esriLoader = require('esri-loader');

var _Progress = require('material-ui/Progress');

var _Translator = require('../../helpers/Translator');

var _Translator2 = _interopRequireDefault(_Translator);

var _Snackbar = require('material-ui/Snackbar');

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _Slide = require('material-ui/transitions/Slide');

var _Slide2 = _interopRequireDefault(_Slide);

var _map = require('../../container-components/map');

var _map2 = _interopRequireDefault(_map);

var _panel = require('../../container-components/panel');

var _panel2 = _interopRequireDefault(_panel);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _EsriLoader = require('../../helpers/EsriLoader');

var _EsriLoader2 = _interopRequireDefault(_EsriLoader);

var _esriModules = require('../../esri-modules');

var _esriModules2 = _interopRequireDefault(_esriModules);

var _scope = require('../../scope');

var _scope2 = _interopRequireDefault(_scope);

var _NormalizationHelper = require('../../helpers/NormalizationHelper');

var _NormalizationHelper2 = _interopRequireDefault(_NormalizationHelper);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_BaseComponent) {
    _inherits(App, _BaseComponent);

    function App() {
        var _temp, _this, _ret;

        _classCallCheck(this, App);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'bf-esri-map', _this.subscription = null, _this.loadESRI = function () {
            (0, _esriLoader.dojoRequire)(_esriModules2.default.map(function (module) {
                return module.name;
            }), function () {
                for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    modules[_key2] = arguments[_key2];
                }

                var modulesBundle = {};
                modules.forEach(function (module, index) {
                    var moduleAlias = _esriModules2.default[index].alias;
                    if (moduleAlias) {
                        modulesBundle[moduleAlias] = module;
                    }
                });
                _scope2.default.ESRI = modulesBundle;
                _this.props.onMapLoaded();
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    App.prototype.componentWillMount = function componentWillMount() {
        var _props = this.props,
            bootstrap = _props.bootstrap,
            config = _props.config,
            data = _props.data,
            mediator = _props.mediator,
            onDataChange = _props.onDataChange,
            onFilter = _props.onFilter;


        _scope2.default.onFilter = onFilter;

        if (!this.subscription) {
            this.subscription = mediator.subscribe('data', function (payload) {
                onDataChange(payload);
            });
        }

        if (!config) return;

        var normalizedConfig = _NormalizationHelper2.default.configNormalizer(config);
        normalizedConfig.data = data;
        normalizedConfig.authentication = config.authentication;

        var translate = void 0;

        switch (config.language) {
            case 'en':
                translate = (0, _Translator2.default)('english');
                break;
            default:
            case 'pt':
                translate = (0, _Translator2.default)('portuguese');
                break;
        }

        _scope2.default.translate = translate;

        bootstrap(normalizedConfig);
    };

    App.prototype.render = function render() {
        var _props2 = this.props,
            navOpened = _props2.navOpened,
            mapLoaded = _props2.mapLoaded,
            config = _props2.config;


        var pathToESRI = config.pathToESRI || "";

        var options = {
            url: pathToESRI + "esri/dojo/dojo.js"
        };

        var esriCSS = pathToESRI + 'esri/esri/css/esri.css';
        var calciteCSS = pathToESRI + 'esri/esri/css/calcite.css';

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement('link', { href: esriCSS, rel: 'stylesheet', id: 'esriCSS' }),
            _react2.default.createElement('link', { href: calciteCSS, rel: 'stylesheet', id: 'calciteCSS' }),
            _react2.default.createElement(_EsriLoader2.default, { options: options, ready: this.loadESRI }),
            _react2.default.createElement(
                'div',
                { className: this.class('app-container') },
                _react2.default.createElement(
                    'section',
                    { className: this.class('map-section') },
                    _react2.default.createElement(
                        'div',
                        { className: this.class('loading'), style: { display: !mapLoaded ? 'flex' : 'none', right: navOpened ? 450 : 0 } },
                        _react2.default.createElement(_Progress.CircularProgress, { size: 80, color: 'primary' })
                    ),
                    mapLoaded && _react2.default.createElement(_map2.default, null)
                ),
                _react2.default.createElement(
                    'section',
                    { className: this.class('panel-section') },
                    _react2.default.createElement(
                        'div',
                        { className: this.class('wrapper'), style: { right: navOpened ? 0 : -450 } },
                        _react2.default.createElement(_panel2.default, null)
                    )
                )
            )
        );
    };

    return App;
}(_BaseComponent3.default);

exports.default = App;
module.exports = exports['default'];