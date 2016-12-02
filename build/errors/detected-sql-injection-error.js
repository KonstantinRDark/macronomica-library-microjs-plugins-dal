'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = (app, _ref) => {
  let property = _ref.property,
      value = _ref.value,
      info = _objectWithoutProperties(_ref, ['property', 'value']);

  app.log.error(_error.ERROR_DETECTED_SQL_INJECTION, _extends({ property, value }, info));
  return (0, _error2.default)(_extends({ message: _error.ERROR_DETECTED_SQL_INJECTION }, info));
};
//# sourceMappingURL=detected-sql-injection-error.js.map