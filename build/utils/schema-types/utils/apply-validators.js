"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyValidators;
function applyValidators(options, schema, validators) {
  return validators.reduce(function (schema, validator) {
    return validator(options, schema);
  }, schema);
}
//# sourceMappingURL=apply-validators.js.map