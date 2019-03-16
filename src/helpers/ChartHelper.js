import Chart from 'chart.js';

export default class ChartHelper {

    static buildStackedBubbleBase64({canvas, metrics, attributes}) {

        return new Promise((resolve, reject) => {

            const data = ChartHelper.prepareData(attributes, metrics, true);

            new Chart(canvas.getContext('2d'), {
                data: data,
                type: 'polarArea',
                plugins: [{
                    afterRender: () => {
                        const base64 = canvas.toDataURL('image/png', 0.5);
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
    }

    static buildStackedBubble({canvas, metrics, attributes, chart}) {
        const data = ChartHelper.prepareData(attributes, metrics);
        const config = {
            data: data,
            type: 'polarArea',
            options: {
                responsive: false
            }
        };

        if (chart) {
            chart.destroy();
        }

        return new Chart(canvas.getContext('2d'), config);
    }

    static prepareData(attributes, metrics, noLegend) {

        const dataset = {
            data: [],
            backgroundColor: []
        };

        const labels = [];

        const {data, backgroundColor} = dataset;

        metrics.forEach(metric => {
            data.push(attributes[metric.metric]);
            backgroundColor.push(metric.color);
            if (noLegend) return;
            labels.push(metric.label || metric.metric);
        });

        return {
            datasets: [dataset],
            labels
        };
    }

}
