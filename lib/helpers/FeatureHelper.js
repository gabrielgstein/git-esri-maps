'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FeatureHelper = function () {
    function FeatureHelper() {
        _classCallCheck(this, FeatureHelper);
    }

    FeatureHelper.getAttribute = function getAttribute(attribute, attributes) {
        var source = attributes;
        if (attribute.startsWith('[G]')) {
            attribute = attribute.substring(3);
            source = attributes.__geo;
        }
        return source[attribute];
    };

    FeatureHelper.getSingleMetric = function getSingleMetric(item, attributes) {
        if (typeof item === 'string') {
            return FeatureHelper.getSingleMetricRegex(item, attributes);
        } else {
            return FeatureHelper.getSingleMetricArray(item, attributes);
        }
    };

    FeatureHelper.getSingleMetricRegex = function getSingleMetricRegex(item, attributes) {
        return item.replace(/\#\{([^}]+)\}/g, function (fullMatch, groupMatch) {
            return FeatureHelper.getAttribute(groupMatch, attributes);
        });
    };

    FeatureHelper.getSingleMetricArray = function getSingleMetricArray(item, attributes) {
        var _ref = item || {},
            prefix = _ref.prefix,
            metric = _ref.metric,
            suffix = _ref.suffix;

        var text = '';

        if (prefix) {
            text += prefix;
        }

        if (metric) {
            text += FeatureHelper.getAttribute(metric, attributes);
        }

        if (suffix) {
            text += suffix;
        }

        return text;
    };

    FeatureHelper.getMetrics = function getMetrics(items, attributes) {
        var textParts = [];

        if (typeof items === 'string') {
            textParts.push(FeatureHelper.getSingleMetric(items, attributes));
        } else {
            items.forEach(function (item) {
                textParts.push(FeatureHelper.getSingleMetric(item, attributes));
            });
        }

        return textParts.join(' ');
    };

    return FeatureHelper;
}();

exports.default = FeatureHelper;
module.exports = exports['default'];