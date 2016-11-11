'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setMinMax;

var _isNumber = require('./../../../is-number');

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setMinMax() {
  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (options, schema) {
    var defaultMin = defaults.min,
        defaultMax = defaults.max;
    var _options$min = options.min,
        min = _options$min === undefined ? defaultMin : _options$min,
        _options$max = options.max,
        max = _options$max === undefined ? defaultMax : _options$max;

    var hasMin = (0, _isNumber2.default)(min);
    var hasMax = (0, _isNumber2.default)(max);

    if (hasMin) {
      if (min < defaultMin) {
        min = defaultMin;
      }
      if (hasMax && min > max) {
        min = max;
      }
      schema = schema.min(+min);
    }

    if (hasMax) {
      if (max > defaultMax) {
        max = defaultMax;
      }
      if (hasMin && max < min) {
        max = min;
      }
      schema = schema.max(+max);
    }

    return schema;
  };
}
//# sourceMappingURL=set-min-max.js.map