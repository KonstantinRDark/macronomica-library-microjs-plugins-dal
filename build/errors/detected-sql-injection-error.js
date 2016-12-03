'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_DETECTED_SQL_INJECTION = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ERROR_DETECTED_SQL_INJECTION = exports.ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;

exports.default = (app, _ref) => {
  let property = _ref.property,
      value = _ref.value,
      info = _objectWithoutProperties(_ref, ['property', 'value']);

  const e = (0, _microjs.error)(_extends({
    plugin: _constants.PLUGIN_SHORT_NAME,
    message: ERROR_DETECTED_SQL_INJECTION
  }, info));

  app.log.error(e.message, _extends({ property, value }, info));
  return e;
};
//# sourceMappingURL=detected-sql-injection-error.js.map