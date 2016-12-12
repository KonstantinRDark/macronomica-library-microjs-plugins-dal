'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCreate = buildCreate;

var _setParams = require('./../../../utils/set-params');

var _setParams2 = _interopRequireDefault(_setParams);

var _convertToResponse = require('./../../../utils/convert-to-response');

var _convertToResponse2 = _interopRequireDefault(_convertToResponse);

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'create' };

exports.default = (app, middleware, plugin) => msg => buildCreate(app, middleware, msg);

function buildCreate(app, middleware, _ref) {
  let schema = _ref.schema,
      params = _ref.params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;

  const isBulkInsert = Array.isArray(params);
  const __fields = schema.getMyFields(fields);

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let builder;

    // Создание множества записей
    if (isBulkInsert) {
      /*
      if (transaction) {
        // Если передали внешнюю транзакцию - привяжемся к ней
        builder = bulkCreate(app, middleware, schema, params, __fields, transaction, reject);
      } else {
      */
      // Создаем свою
      builder = middleware.transaction(trx => bulkCreate(app, middleware, schema, params, __fields, trx, reject).then(trx.commit).catch(trx.rollback));
      /*
      }
      */
    }
    // Создание одной записи
    else {
        builder = middleware(schema.tableName).insert((0, _setParams2.default)(app, schema, params, reject)).returning(...__fields);
        /*
        if (transaction) {
          // Если передали внешнюю транзакцию - привяжемся к ней
          builder = builder.transacting(transaction);
        }
        */
      }

    if ( /*transaction ||*/outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
    }

    // Иначе вызовем его выполнение
    builder.then(result => {
      if (!result) {
        return result;
      }

      if (isBulkInsert) {
        return result.map((0, _convertToResponse2.default)(schema, __fields));
      }

      return (0, _convertToResponse2.default)(schema, __fields)(result);
    }).then(resolve).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO)).catch(reject);
  });
}

function bulkCreate(app, middleware, schema) {
  let params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let fields = arguments[4];
  let trx = arguments[5];
  let reject = arguments[6];

  return middleware(schema.tableName).insert(params.map(params => (0, _setParams2.default)(app, schema, params, reject))).returning(...fields).transacting(trx).then(function () {
    let ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    const max = ids.reduce((max, id) => max < id ? id : max, 0);
    return middleware.raw(`ALTER SEQUENCE "${ schema.tableName }_id_seq" RESTART WITH ${ max };`).then(() => ids);
  });
}
//# sourceMappingURL=create.js.map