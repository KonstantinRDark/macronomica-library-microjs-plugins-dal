'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (properties) {
  return Object.keys(properties).filter(function (key) {
    if (properties[key].type.value === 'array') {
      return true;
    }
  });
};
//# sourceMappingURL=check-array.js.map