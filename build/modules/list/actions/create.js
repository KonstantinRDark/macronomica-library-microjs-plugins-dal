'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCreate = buildCreate;

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _convertToResponse = require('./../../../utils/convert-to-response');

var _convertToResponse2 = _interopRequireDefault(_convertToResponse);

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'create' };
const SetParamsInternalError = (0, _typed2.default)({
  message: '{name} - параметры для создания записи не корректны',
  type: 'micro.plugins.dal.schema.set-params.params.not.correct',
  code: 500
});

exports.default = (app, middleware, plugin) => msg => buildCreate(app, middleware, msg);

function buildCreate(app, middleware, _ref) {
  let schema = _ref.schema,
      params = _ref.params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
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
    let __params;

    try {
      __params = isBulkInsert ? params.map(params => schema.setParams(params)) : schema.setParams(params);
    } catch (e) {
      if (e.type === 'micro.plugins.dal.schema.validate.error') {
        return reject(e);
      }

      app.log.error(e);
      return reject(SetParamsInternalError());
    }

    // Создание множества записей
    if (isBulkInsert) {
      // Создаем свою transaction
      builder = middleware.transaction(trx => bulkCreate(middleware, schema.tableName, __params, __fields, trx, reject).then(trx.commit).catch(trx.rollback));
    }
    // Создание одной записи
    else {
        builder = middleware(schema.tableName).insert(__params).returning(...__fields);
      }

    if (outer) {
      // Если кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
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

function bulkCreate(middleware, tableName) {
  let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let fields = arguments[3];
  let trx = arguments[4];

  return middleware(tableName).insert(params).returning(...fields).transacting(trx).then(function () {
    let ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    const max = ids.reduce((max, id) => max < id ? id : max, 0);
    return middleware.raw(`ALTER SEQUENCE "${ tableName }_id_seq" RESTART WITH ${ max };`).then(() => ids);
  });
}
//# sourceMappingURL=create.js.map