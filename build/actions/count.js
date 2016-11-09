'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.buildCount = buildCount;

var _setCriteria = require('./../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, criteria, options) {
    return buildCount(middleware, schema, criteria, options);
  };
};

function buildCount(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$sql = _ref.sql,
      sql = _ref$sql === undefined ? false : _ref$sql;

  return new Promise(function (resolve, reject) {
    criteria = schema.getMyParams(criteria);

    var table = middleware(schema.tableName);

    var builder = (0, _setCriteria2.default)(table, criteria, reject).count();

    if (sql) {
      return resolve(builder.toSQL());
    }

    return builder.then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 1),
          count = _ref3[0].count;

      return { count: +count };
    }).then(resolve).catch(function (error) {
      reject({
        code: _constants.ERROR_COUNT,
        message: error.detail || error.message.split(' - ')[1]
      });
    });
  });
}
//# sourceMappingURL=count.js.map