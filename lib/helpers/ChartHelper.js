'use strict';

exports.__esModule = true;
exports.default = undefined;

var _chart = require('chart.js');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartHelper = function () {
    function ChartHelper() {
        _classCallCheck(this, ChartHelper);
    }

    ChartHelper.buildStackedBubbleBase64 = function buildStackedBubbleBase64(_ref) {
        var canvas = _ref.canvas,
            metrics = _ref.metrics,
            attributes = _ref.attributes;


        return new Promise(function (resolve, reject) {

            var data = ChartHelper.prepareData(attributes, metrics, true);

            new _chart2.default(canvas.getContext('2d'), {
                data: data,
                type: 'polarArea',
                plugins: [{
                    afterRender: function afterRender() {
                        var base64 = canvas.toDataURL('image/png', 0.5);
                        resolve(base64);
                    }
                }],
                options: {
                    animation: {
                        duration: 0,
                        animateRotate: false,
                        animateScale: false
                    },
                    responsive: false
                }
            });
        });
    };

    ChartHelper.buildStackedBubble = function buildStackedBubble(_ref2) {
        var canvas = _ref2.canvas,
            metrics = _ref2.metrics,
            attributes = _ref2.attributes,
            chart = _ref2.chart;

        var data = ChartHelper.prepareData(attributes, metrics);
        var config = {
            data: data,
            type: 'polarArea',
            options: {
                responsive: false
            }
        };

        if (chart) {
            chart.destroy();
        }

        return new _chart2.default(canvas.getContext('2d'), config);
    };

    ChartHelper.prepareData = function prepareData(attributes, metrics, noLegend) {

        var dataset = {
            data: [],
            backgroundColor: []
        };

        var labels = [];

        var data = dataset.data,
            backgroundColor = dataset.backgroundColor;


        metrics.forEach(function (metric) {
            data.push(attributes[metric.metric]);
            backgroundColor.push(metric.color);
            if (noLegend) return;
            labels.push(metric.label || metric.metric);
        });

        return {
            datasets: [dataset],
            labels: labels
        };
    };

    return ChartHelper;
}();

exports.default = ChartHelper;
module.exports = exports['default'];