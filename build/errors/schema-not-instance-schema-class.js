'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;

exports.default = function () {
  let info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (0, _microjs.error)(_extends({
    plugin: _constants.PLUGIN_SHORT_NAME,
    message: ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS
  }, info));
};
//# sourceMappingURL=schema-not-instance-schema-class.js.map