'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildFindList = buildFindList;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _isNumber = require('./../../utils/is-number');

var _isNumber2 = _interopRequireDefault(_isNumber);

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
    return buildFindList(middleware, schema, criteria, options);
  };
};

function buildFindList(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$sql = options.sql,
      sql = _options$sql === undefined ? false : _options$sql,
      fields = options.fields,
      _options$sort = options.sort,
      sort = _options$sort === undefined ? 'id' : _options$sort,
      limit = options.limit,
      offset = options.offset;


  var manyLinks = (0, _checkArray2.default)(schema.properties);

  return new Promise(function (resolve, reject) {
    var _setCriteria;

    var builder = (_setCriteria = (0, _setCriteria3.default)(middleware(schema.tableName), schema.getMyParams(criteria), reject)).select.apply(_setCriteria, _toConsumableArray(schema.getMyFields(fields)));

    if (sort) {
      var orderKey = void 0;
      var orderDirection = void 0;

      if ((0, _lodash2.default)(sort)) {
        sort = sort.split(' ');

        if (sort.length === 2) {
          orderKey = sort[0];
          orderDirection = ['asc', 'desc'].includes(sort[1].toLowerCase()) ? sort[1].toLowerCase() : 'asc';
        } else {
          orderKey = sort;
          orderDirection = 'asc';
        }
      }

      if (orderKey && orderDirection) {
        builder = builder.orderBy(orderKey, orderDirection);
      }
    }

    if (limit && (0, _isNumber2.default)(limit)) {
      builder = builder.limit(limit);
    }

    if (offset && (0, _isNumber2.default)(offset)) {
      builder = builder.offset(offset);
    }

    if (sql) {
      resolve(builder.toSQL());
    } else {
      builder.then(function () {
        var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (manyLinks.length > 0) {
          result = result.map(function (item) {
            manyLinks.forEach(function (name) {
              if (name in item && !!item[name] && (0, _lodash2.default)(item[name])) {
                item[name] = item[name].split(',');
              }
            });

            return item;
          });
        }

        resolve(result.map(function (row) {
          return _extends({}, row);
        }));
      }).catch(function (error) {
        reject({
          code: _constants.ERROR_FIND_LIST,
          message: error.detail || error.message.split(' - ')[1]
        });
      });
    }
  });
}
//# sourceMappingURL=list.js.map