'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const KEY = exports.KEY = 'like';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */

exports.default = (builder, property, value) => {
  return builder.where(property, 'like', value);
};
//# sourceMappingURL=like.js.map