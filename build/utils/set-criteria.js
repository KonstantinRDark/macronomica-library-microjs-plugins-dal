'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _criteria = require('./criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var _sqlStringProtector = require('./sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

var _errors = require('./../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ERROR_INFO = { module: 'utils', action: 'set-criteria' };

exports.default = (app, builder, params, reject) => {
  var _params$or = params.or;

  const or = _params$or === undefined ? [] : _params$or,
        and = _objectWithoutProperties(params, ['or']);

  return builder.where(addWhere(and)).andWhere(function () {
    const builder = this;
    or.forEach(params => builder.orWhere(addWhere(params)));
  });

  function addWhere(obj) {
    return function () {
      const builder = this;
      setWhere(app, builder, obj, reject);
    };
  }
};

function setWhere(app, builder, params, reject) {
  const keys = Object.keys(params);

  for (let property of keys) {
    const value = params[property];

    if ((0, _lodash2.default)(value)) {
      Object.keys(value).forEach(key => {
        const criteriaCallback = _criteria2.default[key.toLowerCase()];

        if ((0, _lodash4.default)(criteriaCallback)) {
          builder = criteriaCallback(builder, property, value[key]);
        }
      });
    } else {

      if (!(0, _sqlStringProtector2.default)(value)) {
        reject((0, _errors.detectedSqlInjectionError)(app, _extends({}, ERROR_INFO, { property, value })));
        break;
      }

      builder = builder.where(property, value);
    }
  }

  return builder;
}
//# sourceMappingURL=set-criteria.js.map