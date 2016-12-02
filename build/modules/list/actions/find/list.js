'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.buildFindList = buildFindList;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _lodash3 = require('lodash.isnumber');

var _lodash4 = _interopRequireDefault(_lodash3);

var _setCriteria = require('./../../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _checkConvertOut = require('./../../../../utils/check-convert-out');

var _checkConvertOut2 = _interopRequireDefault(_checkConvertOut);

var _constants = require('./../../constants');

var _errors = require('../../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'find-list' };

exports.default = (app, middleware, plugin) => msg => buildFindList(app, middleware, msg);

function buildFindList(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;
  var _options$sort = options.sort;
  const sort = _options$sort === undefined ? 'id' : _options$sort,
        limit = options.limit,
        offset = options.offset;


  const convertOuts = (0, _checkConvertOut2.default)(schema.properties);

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), schema.getMyParams(criteria), reject).select(...schema.getMyFields(fields));

    if (sort) {
      let orderKey;
      let orderDirection;

      if ((0, _lodash2.default)(sort)) {
        var _sort$split = sort.split(' ');

        var _sort$split2 = _slicedToArray(_sort$split, 2);

        orderKey = _sort$split2[0];
        var _sort$split2$ = _sort$split2[1];
        orderDirection = _sort$split2$ === undefined ? 'asc' : _sort$split2$;


        orderDirection = ['asc', 'desc'].includes(orderDirection.toLowerCase()) ? orderDirection.toLowerCase() : 'asc';
      }

      if (orderKey && orderDirection) {
        builder = builder.orderBy(orderKey, orderDirection);
      }
    }

    if (limit && (0, _lodash4.default)(limit)) {
      builder = builder.limit(limit);
    }

    if (offset && (0, _lodash4.default)(offset)) {
      builder = builder.offset(offset);
    }
    /*
    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }
    */
    if ( /*transaction || */outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
    }

    builder.then(function () {
      let result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (convertOuts.length > 0) {
        result = result.map(item => {

          for (let _ref2 of convertOuts) {
            let name = _ref2.name;
            let callback = _ref2.callback;

            item[name] = callback(item[name], schema.properties[name]);
          }

          return item;
        });
      }

      resolve(result.map(row => _extends({}, row)));
    }).catch((0, _errors.internalError)(app, ERROR_INFO)).catch(reject);
  });
}
//# sourceMappingURL=list.js.map