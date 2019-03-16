'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _materialUiIcons = require('material-ui-icons');

var MaterialIcons = _interopRequireWildcard(_materialUiIcons);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UIHelper = function () {
    function UIHelper() {
        _classCallCheck(this, UIHelper);
    }

    UIHelper.getIcon = function getIcon(iconName, props) {

        switch (iconName) {

            case 'Ruler':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M1.39,18.36L3.16,16.6L4.58,18L5.64,16.95L4.22,15.54L5.64,14.12L8.11,16.6L9.17,15.54L6.7,13.06L8.11,11.65L9.53,13.06L10.59,12L9.17,10.59L10.59,9.17L13.06,11.65L14.12,10.59L11.65,8.11L13.06,6.7L14.47,8.11L15.54,7.05L14.12,5.64L15.54,4.22L18,6.7L19.07,5.64L16.6,3.16L18.36,1.39L22.61,5.64L5.64,22.61L1.39,18.36Z' })
                );
            case 'Cursor':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z' })
                );
            case 'Funnel':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z' })
                );

            case 'DragVertical':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z' })
                );

            case 'ChevronDown':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' })
                );

            case 'ChevronUp':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z' })
                );
            case 'Opacity':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M14,4C17.32,4 20,6.69 20,10C20,13.32 17.32,16 14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z' })
                );
            case 'MultiFilter':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M10.2 13.5V21.4C10.3 21.7 10.2 22 9.9 22.2 9.5 22.6 8.9 22.6 8.5 22.2L6.5 20.2C6.3 20 6.2 19.7 6.2 19.4V13.5H6.2L0.4 6.1C0.1 5.7 0.2 5.1 0.6 4.7 0.8 4.6 1 4.5 1.2 4.5V4.5H15.2V4.5C15.4 4.5 15.6 4.6 15.8 4.7 16.3 5.1 16.3 5.7 16 6.1L10.2 13.5H10.2z' }),
                    _react2.default.createElement('path', { d: 'M16.6 8.5V16.4C16.6 16.7 16.5 17 16.3 17.2 15.9 17.6 15.3 17.6 14.9 17.2L12.9 15.2C12.6 15 12.5 14.7 12.6 14.4V8.5H12.5L6.8 1.1C6.4 0.7 6.5 0.1 7-0.3 7.1-0.4 7.4-0.5 7.6-0.5V-0.5H21.6V-0.5C21.8-0.5 22-0.4 22.2-0.3 22.6 0.1 22.7 0.7 22.4 1.1L16.6 8.5H16.6z' })
                );
            case 'Filter':
                return _react2.default.createElement(
                    'svg',
                    _extends({ style: { width: '24px', height: '24px' }, viewBox: '0 0 24 24' }, props),
                    _react2.default.createElement('path', { d: 'M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z' })
                );

            default:
                var IconClass = MaterialIcons[iconName];
                if (IconClass) {
                    return _react2.default.createElement(IconClass, props);
                }

        }
    };

    UIHelper.getLegendSymbol = function getLegendSymbol(_ref, className) {
        var shape = _ref.shape,
            color = _ref.color,
            borderWidth = _ref.borderWidth,
            borderColor = _ref.borderColor,
            style = _ref.style;


        if (Array.isArray(color)) {
            color = (0, _chromaJs2.default)(color).hex();
        }

        var pathStyle = {
            fill: color || '#154673',
            stroke: borderColor || '#000',
            strokeWidth: borderWidth || 1
        };

        var path = void 0,
            viewBox = '0 0 100 100';
        switch (shape) {
            case 'school':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M961,1000C980,1000,995,985,995,967V418C995,399,980,384,961,384H755V363C755,350,748,339,737,333L535,231V167L677,120C691,115,700,103,700,88C700,74,691,61,677,57L513,2C502-2,491,0,483,6C474,13,469,23,469,33V231L267,333C256,339,249,350,249,363V384H39C20,384,5,399,5,418V967C5,985,20,1000,39,1000H961zM535,106V71L608,88L535,106zM72,451H249V933H72V451zM316,383L502,289L688,383V933H316V383zM928,933H755V451H928V933zM450,439H396C377,439,362,454,362,473C362,491,377,506,396,506H450C469,506,484,491,484,473C484,454,469,439,450,439zM138,561H193C212,561,227,546,227,527C227,509,212,494,193,494H138C120,494,105,509,105,527C105,546,120,561,138,561zM193,604H138C120,604,105,619,105,637C105,656,120,671,138,671H193C212,671,227,656,227,637C227,619,212,604,193,604zM193,714H138C120,714,105,729,105,747C105,765,120,780,138,780H193C212,780,227,765,227,747C227,729,212,714,193,714zM817,561H872C891,561,906,546,906,527C906,509,891,494,872,494H817C799,494,784,509,784,527C784,546,799,561,817,561zM817,671H872C891,671,906,656,906,637C906,619,891,604,872,604H817C799,604,784,619,784,637C784,656,799,671,817,671zM872,714H817C799,714,784,729,784,747C784,765,799,780,817,780H872C891,780,906,765,906,747C906,729,891,714,872,714zM615,439H560C542,439,527,454,527,473C527,491,542,506,560,506H615C634,506,648,491,648,473C648,454,634,439,615,439zM450,549H396C377,549,362,564,362,582C362,601,377,616,396,616H450C469,616,484,601,484,582C484,564,469,549,450,549zM615,549H560C542,549,527,564,527,582C527,601,542,616,560,616H615C634,616,648,601,648,582C648,564,634,549,615,549zM450,659H396C377,659,362,674,362,692C362,711,377,725,396,725H450C469,725,484,711,484,692C484,674,469,659,450,659zM615,659H560C542,659,527,674,527,692C527,711,542,725,560,725H615C634,725,648,711,648,692C648,674,634,659,615,659z' }));
                viewBox = '0 0 1000 1000';
                break;
            case 'star':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M50,70l20,14.641l-2.679,-24.641l22.679,-10l-22.679,-10l2.679,-24.641l-20,14.641l-20,-14.641l2.679,24.641l-22.679,10l22.679,10l-2.679,24.641z' }));
                viewBox = '10 10 80 80';
                break;
            case 'cross':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M 944 144 944 174M 929 159 959 159', transform: 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)' }));
                viewBox = '927 142 35 35';
                break;
            case 'diamond':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M-10,-15l15,15l-15,15l-15,-15z', transform: 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)' }));
                viewBox = '-27 -17 35 35';
                break;
            default:
            case 'square':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M 1356 325 1376 325 1376 345 1356 345Z', transform: 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)' }));
                viewBox = '1351 320 30 30';
                break;
            case 'x':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: 'M-419 369-389 399M-419 399-389 369', transform: 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)' }));
                viewBox = '-421 367 35 35';
                break;
            case 'circle':
            case 'round':
                path = _react2.default.createElement('path', _extends({}, pathStyle, { d: ' M 50, 50 m -37.5, 0 a 37.5,37.5 0 1,0 75,0 a 37.5,37.5 0 1,0 -75,0' }));
                break;
        }

        return _react2.default.createElement(
            'svg',
            { viewBox: viewBox, style: style, className: className },
            path
        );
    };

    return UIHelper;
}();

exports.default = UIHelper;
module.exports = exports['default'];