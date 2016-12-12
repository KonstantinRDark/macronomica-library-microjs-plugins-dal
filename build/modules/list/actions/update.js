'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildUpdate = buildUpdate;

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setCriteria = require('./../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _setParams = require('./../../../utils/set-params');

var _setParams2 = _interopRequireDefault(_setParams);

var _convertToResponse = require('./../../../utils/convert-to-response');

var _convertToResponse2 = _interopRequireDefault(_convertToResponse);

var _pins = require('../../../pins');

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'update' };

exports.default = (app, middleware, plugin) => msg => buildUpdate(app, middleware, msg);

function buildUpdate(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$params = _ref.params;
  let params = _ref$params === undefined ? {} : _ref$params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;

  const __fields = schema.getMyFields(fields);

  if (!params) {
    return Promise.resolve(null);
  }

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    // Узнаем кол-во обновляемых строк
    app.act(_extends({}, _pins.PIN_LIST_COUNTS, { schema, criteria })).then((_ref2) => {
      let count = _ref2.count;

      // Если равно 0 - то и обновлять не стоит
      if (count === 0) {
        return null;
      }

      let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), criteria, reject).update((0, _setParams2.default)(app, schema, params, reject)).returning(...__fields);
      /*
      if (transaction) {
        // Если передали внешнюю транзакцию - привяжемся к ней
        builder = builder.transacting(transaction);
      }
      */
      if ( /*transaction || */outer) {
        // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
        return builder;
      }

      return builder.then(result => {
        if (!result) {
          return result;
        }

        if (Array.isArray(result)) {
          return result.map((0, _convertToResponse2.default)(schema, __fields));
        }

        return (0, _convertToResponse2.default)(schema, __fields)(result);
      }).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO));
    }).then(resolve).catch(reject);
  });
}
//# sourceMappingURL=update.js.map