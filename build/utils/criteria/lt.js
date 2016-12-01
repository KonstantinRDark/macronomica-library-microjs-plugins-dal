'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const KEY = exports.KEY = 'lt';

/**
 * @param {object} builder
 * @param {string} property
 * @param {*} value
 * @returns {*}
 */

exports.default = (builder, property, value) => {
  return builder.where(property, '<', value);
};
//# sourceMappingURL=lt.js.map