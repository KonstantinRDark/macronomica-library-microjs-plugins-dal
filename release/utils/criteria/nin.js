'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEY = exports.KEY = 'nin';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */

exports.default = function (builder, property, value) {
  return builder.whereNotIn(property, value);
};
//# sourceMappingURL=nin.js.map
