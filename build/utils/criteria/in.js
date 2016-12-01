'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const KEY = exports.KEY = 'in';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */

exports.default = (builder, property, value) => {
  return builder.whereIn(property, value);
};
//# sourceMappingURL=in.js.map