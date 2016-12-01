'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KEY = undefined;

var _isRange = require('./../is-range');

var _isRange2 = _interopRequireDefault(_isRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KEY = exports.KEY = 'nbwn';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */
exports.default = (builder, property, value) => {
  if (!(0, _isRange2.default)(value)) {
    return builder;
  }

  return builder.whereNotBetween(property, value);
};
//# sourceMappingURL=not-between.js.map