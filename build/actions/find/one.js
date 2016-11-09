'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.buildFindOne = buildFindOne;

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isstring');

var _lodash4 = _interopRequireDefault(_lodash3);

var _setCriteria2 = require('./../../utils/set-criteria');

var _setCriteria3 = _interopRequireDefault(_setCriteria2);

var _checkArray = require('./../../utils/check-array');

var _checkArray2 = _interopRequireDefault(_checkArray);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (middleware, micro, plugin) {
  return function (schema) {
    var criteria = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments[2];
    return buildFindOne(middleware, schema, criteria, options);
  };
};

function buildFindOne(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      fields = _ref.fields,
      _ref$sql = _ref.sql,
      sql = _ref$sql === undefined ? false : _ref$sql;

  return new Promise(function (resolve, reject) {
    var _setCriteria;

    criteria = schema.getMyParams(criteria);
    var manyLinks = (0, _checkArray2.default)(schema.properties);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    var table = middleware(schema.tableName);
    var builder = (_setCriteria = (0, _setCriteria3.default)(table, criteria, reject)).select.apply(_setCriteria, _toConsumableArray(schema.getMyFields(fields))).limit(1);

    if (sql) {
      return resolve(builder.toSQL());
    }

    builder.then(function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
          _ref3 = _slicedToArray(_ref2, 1),
          result = _ref3[0];

      if (!result) {
        resolve(null);
      }

      manyLinks.forEach(function (name) {
        if (name in result && !!result[name] && (0, _lodash4.default)(result[name])) {
          result[name] = result[name].split(',');
        }
      });

      resolve(_extends({}, result));
    }).catch(function (error) {
      reject({
        code: _constants.ERROR_FIND_ONE,
        message: error.detail || error.message.split(' - ')[1]
      });
    });
  });
}
//# sourceMappingURL=one.js.map