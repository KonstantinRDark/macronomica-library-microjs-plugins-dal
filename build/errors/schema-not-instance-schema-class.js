'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;

exports.default = function () {
  let info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (0, _microjs.error)((0, _extends3.default)({
    plugin: _constants.PLUGIN_SHORT_NAME,
    message: ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS
  }, info));
};
//# sourceMappingURL=schema-not-instance-schema-class.js.map