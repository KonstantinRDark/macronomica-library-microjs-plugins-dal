'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _criteria = require('./criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var _sqlStringProtector = require('./sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (builder, params, reject) {
  var _params$or = params.or,
      or = _params$or === undefined ? [] : _params$or,
      and = _objectWithoutProperties(params, ['or']);

  return builder.where(addWhere(and)).andWhere(function () {
    var builder = this;
    or.forEach(function (params) {
      return builder.orWhere(addWhere(params));
    });
  });

  function addWhere(obj) {
    return function () {
      var builder = this;
      setWhere(builder, obj, reject);
    };
  }
};

function setWhere(builder, params, reject) {
  var keys = Object.keys(params);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var property = _step.value;

      var value = params[property];

      if ((0, _lodash2.default)(value)) {
        Object.keys(value).forEach(function (key) {
          var criteriaCallback = _criteria2.default[key.toLowerCase()];

          if ((0, _lodash4.default)(criteriaCallback)) {
            builder = criteriaCallback(builder, property, value[key]);
          }
        });
      } else {

        if (!(0, _sqlStringProtector2.default)(value)) {
          reject({
            code: 'detected.sql.injection',
            message: '\u041F\u0440\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0430 SQL-Injection \u0432 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0435 {' + property + ': "' + value + '"' });
          return 'break';
        }

        builder = builder.where(property, value);
      }
    };

    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if (_ret === 'break') break;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return builder;
}
//# sourceMappingURL=set-criteria.js.map