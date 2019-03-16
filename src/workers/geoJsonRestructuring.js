// worker.js
const workercode = () => {

    self.onmessage = function(e) {
        let arcGisJson = JSON.parse(e.data);
        let FID = 1;
        let shouldGenerateFID;

        for (let field of arcGisJson.fields) {

            if (field.type === 'esriFieldTypeOID' && !field.name) {
                field.name = 'FID';
                shouldGenerateFID = true;
            }

        }

        for (let feature of arcGisJson.features) {

            if (shouldGenerateFID) {
                feature.attributes.FID = FID++;
            }

            const {geometry: {rings}} = feature;
            if (rings) {
                for (let index in rings) {
                    let ring = rings[index];
                    const firstVertice = ring[0];
                    const properRing = [];
                    if (typeof firstVertice === 'number') {
                        while (ring.length) {
                            properRing.push(ring.splice(0, 2).reverse());
                        }
                        rings[index] = properRing;
                    }
                }
            }

        }
        self.postMessage(arcGisJson);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;