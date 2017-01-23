'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _criteria = require('./criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var _sqlStringProtector = require('./sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

var _detectedSqlInjectionError = require('./../errors/detected-sql-injection-error');

var _detectedSqlInjectionError2 = _interopRequireDefault(_detectedSqlInjectionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: 'utils', action: 'set-criteria' };

exports.default = (app, builder, params, reject) => {
  var _params$or = params.or;
  const or = _params$or === undefined ? [] : _params$or,
        and = (0, _objectWithoutProperties3.default)(params, ['or']);


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
  const keys = (0, _keys2.default)(params);

  for (let property of keys) {
    const value = params[property];

    if ((0, _lodash2.default)(value)) {
      (0, _keys2.default)(value).forEach(key => {
        const criteriaCallback = _criteria2.default[key.toLowerCase()];

        if ((0, _lodash4.default)(criteriaCallback)) {
          builder = criteriaCallback(builder, property, value[key]);
        }
      });
    } else {

      if (!(0, _sqlStringProtector2.default)(value)) {
        reject((0, _detectedSqlInjectionError2.default)(app, (0, _extends3.default)({}, ERROR_INFO, { property, value })));
        break;
      }

      builder = builder.where(property, value);
    }
  }

  return builder;
}
//# sourceMappingURL=set-criteria.js.map