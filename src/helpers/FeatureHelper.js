export default class FeatureHelper {

    static getAttribute(attribute, attributes) {
        let source = attributes;
        if (attribute.startsWith('[G]')) {
            attribute = attribute.substring(3);
            source = attributes.__geo;
        }
        return source[attribute];
    }

    static getSingleMetric(item, attributes) {
        if (typeof item === 'string') {
            return FeatureHelper.getSingleMetricRegex(item, attributes);
        } else {
            return FeatureHelper.getSingleMetricArray(item, attributes);
        }
    }

    static getSingleMetricRegex(item, attributes) {
        return item.replace(/\#\{([^}]+)\}/g, function (fullMatch, groupMatch) {
            return FeatureHelper.getAttribute(groupMatch, attributes);
        });
    }

    static getSingleMetricArray(item, attributes) {
        let { prefix, metric, suffix } = item || {};
        let text = '';

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
    }

    static getMetrics(items, attributes) {
        let textParts = [];

        if (typeof items === 'string') {
            textParts.push(FeatureHelper.getSingleMetric(items, attributes));
        } else {
            items.forEach(item => {
                textParts.push(FeatureHelper.getSingleMetric(item, attributes));
            });
        }



        return textParts.join(' ');
    }

}