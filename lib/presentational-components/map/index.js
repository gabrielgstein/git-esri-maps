'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Add = require('material-ui-icons/Add');

var _Add2 = _interopRequireDefault(_Add);

var _Remove = require('material-ui-icons/Remove');

var _Remove2 = _interopRequireDefault(_Remove);

var _antd = require('antd');

var _FilterCenterFocus = require('material-ui-icons/FilterCenterFocus');

var _FilterCenterFocus2 = _interopRequireDefault(_FilterCenterFocus);

var _Button = require('material-ui/Button');

var _Button2 = _interopRequireDefault(_Button);

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _ESRIMap = require('../../classes/ESRIMap');

var _ESRIMap2 = _interopRequireDefault(_ESRIMap);

var _popup = require('../../container-components/popup');

var _popup2 = _interopRequireDefault(_popup);

var _filterBar = require('../../container-components/filter-bar');

var _filterBar2 = _interopRequireDefault(_filterBar);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapComponent = function (_BaseComponent) {
    _inherits(MapComponent, _BaseComponent);

    function MapComponent() {
        var _temp, _this, _ret;

        _classCallCheck(this, MapComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'map-container', _this.handleSingleFilterToggle = function () {
            var toggleSingleFilter = _this.props.toggleSingleFilter;

            toggleSingleFilter();
        }, _this.handleFiltersToggle = function () {
            var filterOptionsShown = _this.state.filterOptionsShown;

            _this.setState({ filterOptionsShown: !filterOptionsShown });
        }, _this.handleAreaFilterToggle = function () {
            var toggleAreaFilter = _this.props.toggleAreaFilter;

            toggleAreaFilter();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    MapComponent.prototype.componentDidMount = function componentDidMount() {
        var _props = this.props,
            zoom = _props.zoom,
            authentication = _props.authentication,
            center = _props.center,
            basemap = _props.basemap;


        new _ESRIMap2.default(this['mapInstance'], {
            basemap: basemap,
            center: center || [241.80, 34.05],
            zoom: zoom || 11,
            autoResize: true,
            slider: false,
            isScrollWheel: false
        }, this.props.dispatch, this.canvas, authentication);
    };

    MapComponent.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props,
            zoomChange = _props2.zoomChange,
            toggleRuler = _props2.toggleRuler,
            rulerEnabled = _props2.rulerEnabled,
            zoom = _props2.zoom,
            changeBasemap = _props2.changeBasemap,
            basemap = _props2.basemap;


        return _react2.default.createElement(
            'div',
            { className: this.class(), ref: function ref(el) {
                    return _this2.mapContainer = el;
                } },
            _react2.default.createElement(
                'div',
                { className: this.class('top') },
                _react2.default.createElement(
                    'div',
                    { className: this.class('basemap-toggle') },
                    _react2.default.createElement(
                        _antd.Radio.Group,
                        { onChange: function onChange(e) {
                                return changeBasemap(e.target.value);
                            }, value: basemap },
                        _react2.default.createElement(
                            _antd.Radio.Button,
                            { value: 'gray' },
                            _react2.default.createElement(
                                _antd.Tooltip,
                                { placement: 'top', title: (0, _scope.translate)('MAP.STREETS_BASEMAP') },
                                (0, _scope.translate)('MAP.STREETS')
                            )
                        ),
                        _react2.default.createElement(
                            _antd.Radio.Button,
                            { value: 'satellite' },
                            _react2.default.createElement(
                                _antd.Tooltip,
                                { placement: 'top', title: (0, _scope.translate)('MAP.SATELLITE_BASEMAP') },
                                (0, _scope.translate)('MAP.SATELLITE')
                            )
                        )
                    )
                ),
                _react2.default.createElement(_filterBar2.default, null)
            ),
            _react2.default.createElement(_popup2.default, null),
            _react2.default.createElement('canvas', { style: { visibility: 'hidden', position: 'absolute' }, width: '200px', height: '200px', ref: function ref(el) {
                    return _this2.canvas = el;
                } }),
            _react2.default.createElement(
                'div',
                { className: this.class('navigation-tools') },
                _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'right', title: (0, _scope.translate)('MAP.INCREASE_ZOOM') },
                    _react2.default.createElement(
                        _Button2.default,
                        { onClick: function onClick() {
                                return zoomChange(true);
                            }, fab: true, color: 'primary', classes: { root: this.baseClass + '-icon' } },
                        _react2.default.createElement(_Add2.default, null)
                    )
                ),
                _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'right', title: (0, _scope.translate)('MAP.CURRENT_ZOOM') },
                    _react2.default.createElement(
                        _Button2.default,
                        { fab: true, color: 'primary', classes: { root: this.baseClass + '-icon' } },
                        _react2.default.createElement(
                            'span',
                            null,
                            zoom
                        )
                    )
                ),
                _react2.default.createElement(
                    _antd.Tooltip,
                    { placement: 'right', title: (0, _scope.translate)('MAP.DECREASE_ZOOM') },
                    _react2.default.createElement(
                        _Button2.default,
                        { onClick: function onClick() {
                                return zoomChange(false);
                            }, fab: true, color: 'primary', classes: { root: this.baseClass + '-icon' } },
                        _react2.default.createElement(_Remove2.default, null)
                    )
                )
            ),
            _react2.default.createElement('div', { className: this.class('map-instance', 'calcite'), ref: function ref(el) {
                    return _this2.mapInstance = el;
                } })
        );
    };

    return MapComponent;
}(_BaseComponent3.default);

exports.default = MapComponent;
module.exports = exports['default'];