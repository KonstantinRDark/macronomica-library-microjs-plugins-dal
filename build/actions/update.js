'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUpdate = buildUpdate;

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _checkArray = require('./../utils/check-array');

var _checkArray2 = _interopRequireDefault(_checkArray);

var _setCriteria = require('./../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _setParams = require('./../utils/set-params');

var _setParams2 = _interopRequireDefault(_setParams);

var _count = require('./count');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, criteria, params, options) {
    return buildUpdate(middleware, schema, criteria, params, options);
  };
};

function buildUpdate(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  return new Promise(function (resolve, reject) {
    criteria = schema.getMyParams(criteria);
    var manyLinks = (0, _checkArray2.default)(schema.properties);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    var table = middleware(schema.tableName);
    var builder = (0, _setCriteria2.default)(table, criteria, reject).update((0, _setParams2.default)(schema, params, reject)).returning('id');

    // Узнаем кол-во обновляемых строк
    (0, _count.buildCount)(middleware, schema, criteria).then(function (_ref) {
      var count = _ref.count;

      // Если равно 0 - то и обновлять не стоит
      if (count === 0) {
        return null;
      }

      manyLinks.forEach(function (name) {
        if (name in params && Array.isArray(params[name])) {
          params[name] = params[name].join(',');
        }
      });

      return builder.catch(function (error) {
        reject(error.code === _constants.ERROR_FIND_ONE ? error : {
          code: _constants.ERROR_UPDATE,
          message: error.detail || error.message.split(' - ')[1]
        });
      });
    }).then(resolve).catch(reject);
  });
}
//# sourceMappingURL=update.js.map