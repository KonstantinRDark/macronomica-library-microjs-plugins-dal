'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_DETECTED_SQL_INJECTION = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_DETECTED_SQL_INJECTION = exports.ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;

exports.default = (app, _ref) => {
  let property = _ref.property,
      value = _ref.value,
      info = (0, _objectWithoutProperties3.default)(_ref, ['property', 'value']);

  const e = (0, _microjs.error)((0, _extends3.default)({
    plugin: _constants.PLUGIN_SHORT_NAME,
    message: ERROR_DETECTED_SQL_INJECTION
  }, info));

  app.log.error(e.message, (0, _extends3.default)({ property, value }, info));
  return e;
};
//# sourceMappingURL=detected-sql-injection-error.js.map