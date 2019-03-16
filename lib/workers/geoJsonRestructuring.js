'use strict';

// worker.js
var workercode = function workercode() {

    self.onmessage = function (e) {
        var arcGisJson = JSON.parse(e.data);
        var FID = 1;
        var shouldGenerateFID = void 0;

        for (var _iterator = arcGisJson.fields, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var field = _ref;


            if (field.type === 'esriFieldTypeOID' && !field.name) {
                field.name = 'FID';
                shouldGenerateFID = true;
            }
        }

        for (var _iterator2 = arcGisJson.features, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var feature = _ref2;


            if (shouldGenerateFID) {
                feature.attributes.FID = FID++;
            }

            var rings = feature.geometry.rings;

            if (rings) {
                for (var index in rings) {
                    var ring = rings[index];
                    var firstVertice = ring[0];
                    var properRing = [];
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
    };
};

var code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

var blob = new Blob([code], { type: "application/javascript" });
var worker_script = URL.createObjectURL(blob);

module.exports = worker_script;