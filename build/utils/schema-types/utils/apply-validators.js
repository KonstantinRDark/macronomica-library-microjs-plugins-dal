"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyValidators;
function applyValidators(options, schema, validators) {
  return validators.reduce((schema, validator) => validator(options, schema), schema);
}
//# sourceMappingURL=apply-validators.js.map