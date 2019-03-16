'use strict';

exports.__esModule = true;

var _english = require('../languages/english');

var _english2 = _interopRequireDefault(_english);

var _portuguese = require('../languages/portuguese');

var _portuguese2 = _interopRequireDefault(_portuguese);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var languages = {
    english: _english2.default,
    portuguese: _portuguese2.default
};

var getTranslator = function getTranslator(language) {
    return function (identifier) {
        var translator = languages[language];
        var fallback = languages['english'];
        return eval('translator.' + identifier + ' || fallback.' + identifier);
    };
};

exports.default = getTranslator;
module.exports = exports['default'];