'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEY = exports.KEY = 'null';

/**
 * @param {object} builder
 * @param {string} property
 * @param {boolean} value
 * @returns {*}
 */

exports.default = function (builder, property, value) {
  if (value === true || value === false) {
    var operation = value === true ? 'whereNull' : 'whereNotNull';
    return builder[operation](property);
  }

  return builder;
};
//# sourceMappingURL=null.js.map
