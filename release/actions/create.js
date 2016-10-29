'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCreate = buildCreate;

var _setParams = require('./../utils/set-params');

var _setParams2 = _interopRequireDefault(_setParams);

var _list = require('./find/list');

var _one = require('./find/one');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, params, options) {
    return buildCreate(middleware, schema, params, options);
  };
};

function buildCreate(middleware, schema) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var isBulkInsert = Array.isArray(params);

  return new Promise(function (resolve, reject) {
    if (!params) {
      return;
    }
    var builder = void 0;

    if (isBulkInsert) {
      builder = middleware.transaction(function (trx) {
        middleware(schema.tableName).insert(params.map(function (params) {
          return (0, _setParams2.default)(schema, params, reject);
        })).returning('id').transacting(trx).then(function (ids) {
          var max = ids.reduce(function (max, id) {
            return max < id ? id : max;
          }, 0);
          return middleware.raw('ALTER SEQUENCE ' + schema.tableName + '_id_seq RESTART WITH ' + max + ';').then(function () {
            return ids;
          });
        }).then(trx.commit).catch(trx.rollback);
      });
    } else {
      builder = middleware(schema.tableName).insert((0, _setParams2.default)(schema, params, reject)).returning('id');
    }

    builder.then(function () {
      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!ids.length) {
        return null;
      }

      if (isBulkInsert) {
        return (0, _list.buildFindList)(middleware, schema, { id: { in: ids } }, options);
      } else {
        return (0, _one.buildFindOne)(middleware, schema, { id: ids[0] }, options);
      }
    }).then(resolve).catch(function (error) {
      reject(error.code === _constants.ERROR_FIND_ONE ? error : {
        code: _constants.ERROR_CREATE,
        message: error.detail
      });
    });
  });
}
//# sourceMappingURL=create.js.map
