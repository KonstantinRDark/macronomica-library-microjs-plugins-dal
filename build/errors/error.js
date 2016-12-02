'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERROR_SEPARATOR = exports.ERROR_SEPARATOR = ':';
const ERROR_PREFIX = exports.ERROR_PREFIX = 'error.plugin-dal';

const ERROR_INTERNAL_ERROR = exports.ERROR_INTERNAL_ERROR = 'internal.error';
const ERROR_PROPERTY_IS_REQUIRED = exports.ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

const ERROR_DETECTED_SQL_INJECTION = exports.ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;
const ERROR_SCHEMA_NOT_FOUND = exports.ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;
const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;

exports.default = (_ref) => {
  var _ref$module = _ref.module;
  let module = _ref$module === undefined ? '-' : _ref$module;
  var _ref$action = _ref.action;
  let action = _ref$action === undefined ? '-' : _ref$action;
  var _ref$message = _ref.message;
  let message = _ref$message === undefined ? '-' : _ref$message;

  return new Error([ERROR_PREFIX, module, action, message].join(ERROR_SEPARATOR));
};
//# sourceMappingURL=error.js.map