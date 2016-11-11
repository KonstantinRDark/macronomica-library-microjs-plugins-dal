'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRequired;
function setRequired(options, schema) {
  var required = options.required;


  if ('required' in options && options.required === true) {
    schema = schema.required();
  }

  return schema;
}
//# sourceMappingURL=set-required.js.map