'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRange;

var _isNumber = require('./is-number');

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isRange(value) {
  return Array.isArray(value) && value.length === 2 && (0, _isNumber2.default)(value[0]) && (0, _isNumber2.default)(value[1]) && +value[0] <= +value[1];
}
//# sourceMappingURL=is-range.js.map
