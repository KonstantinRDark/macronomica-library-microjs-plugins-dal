'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const KEY = exports.KEY = 'gte';

/**
 * @param {object} builder
 * @param {string} property
 * @param {*} value
 * @returns {*}
 */

exports.default = (builder, property, value) => {
  return builder.where(property, '>=', value);
};
//# sourceMappingURL=gte.js.map