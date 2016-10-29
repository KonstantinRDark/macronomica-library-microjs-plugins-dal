"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumber;
function isNumber(value) {
  return isFinite(+value) && !isNaN(+value);
}
//# sourceMappingURL=is-number.js.map
