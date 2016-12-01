'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const PIN_PLUGIN = exports.PIN_PLUGIN = { role: 'plugin' };
const PIN_OPTIONS = exports.PIN_OPTIONS = _extends({}, PIN_PLUGIN, { cmd: 'options' });
const PIN_CONNECTION = exports.PIN_CONNECTION = _extends({}, PIN_PLUGIN, { cmd: 'connection' });

const ERROR_SEPARATOR = exports.ERROR_SEPARATOR = ':';
const ERROR_PREFIX = exports.ERROR_PREFIX = 'error.plugin-dal';

const ERROR_INTERNAL_ERROR = exports.ERROR_INTERNAL_ERROR = 'internal.error';
const ERROR_PROPERTY_IS_REQUIRED = exports.ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

const ERROR_DETECTED_SQL_INJECTION = exports.ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;
const ERROR_SCHEMA_NOT_FOUND = exports.ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;
const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;
//# sourceMappingURL=constants.js.map