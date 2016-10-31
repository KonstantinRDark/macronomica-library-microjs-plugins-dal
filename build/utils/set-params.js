'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sqlStringProtector = require('./sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (schema, params, reject) {
  var keys = Object.keys(params);
  var result = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      var value = params[property];

      if (!(0, _sqlStringProtector2.default)(value)) {
        reject({
          code: 'detected.sql.injection',
          message: '\u041F\u0440\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0430 SQL-Injection \u0432 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0435 {' + property + ': "' + value + '"'
        });
        break;
      }

      if (!schema.has(property)) {
        continue;
      }

      var valid = schema.validate(property, value);

      if (valid.error) {
        reject(valid.error);
        break;
      }

      result[property] = valid.value;
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

  return result;
};
//# sourceMappingURL=set-params.js.map