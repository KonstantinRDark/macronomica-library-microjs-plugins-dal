'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sqlStringProtector = require('./sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

var _detectedSqlInjectionError = require('./../errors/detected-sql-injection-error');

var _detectedSqlInjectionError2 = _interopRequireDefault(_detectedSqlInjectionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: 'utils', action: 'set-params' };

exports.default = function (app, schema) {
  let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let reject = arguments[3];

  const keys = Object.keys(params);
  const result = {};

  for (let property of keys) {
    const value = params[property];

    if (!(0, _sqlStringProtector2.default)(value)) {
      reject((0, _detectedSqlInjectionError2.default)(app, _extends({}, ERROR_INFO, { property, value })));
      break;
    }

    if (!schema.has(property)) {
      continue;
    }

    let valid = schema.validate(property, value);

    if (valid.error) {
      reject(valid.error);
      break;
    }

    result[property] = valid.value;
  }

  return result;
};
//# sourceMappingURL=set-params.js.map