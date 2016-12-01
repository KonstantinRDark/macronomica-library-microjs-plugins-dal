'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const KEY = exports.KEY = 'null';

/**
 * @param {object} builder
 * @param {string} property
 * @param {boolean} value
 * @returns {*}
 */

exports.default = (builder, property, value) => {
  if (value === true || value === false) {
    const operation = value === true ? 'whereNull' : 'whereNotNull';
    return builder[operation](property);
  }

  return builder;
};
//# sourceMappingURL=null.js.map