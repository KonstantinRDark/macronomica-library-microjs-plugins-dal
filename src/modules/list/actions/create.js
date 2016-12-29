import TypedError from 'error/typed';
import convertToResponse from './../../../utils/convert-to-response';
import Schema from './../../../utils/schema';
import { MODULE_NAME } from './../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'create' };
const SetParamsInternalError = TypedError({
  message: '{name} - параметры для создания записи не корректны',
  type   : 'micro.plugins.dal.schema.set-params.params.not.correct',
  code   : 500
});

export default (app, middleware, plugin) => (msg) => buildCreate(app, middleware, msg);

export function buildCreate (app, middleware, { schema, params, options = {} }) {
  const { outer = false, fields } = options;
  const isBulkInsert = Array.isArray(params);
  const __fields = schema.getMyFields(fields);

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let builder;
    let __params;

    try {
      __params = isBulkInsert
        ? params.map(params => schema.setParams(params))
        : schema.setParams(params);
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
        builder = middleware.transaction(trx =>
          bulkCreate(middleware, schema.tableName, __params, __fields, trx, reject)
            .then(trx.commit)
            .catch(trx.rollback)
        );
    }
    // Создание одной записи
    else {
      builder = middleware(schema.tableName)
        .insert(__params)
        .returning(...__fields);
    }

    if (outer) {
      // Если кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    // Иначе вызовем его выполнение
    builder
      .then(result => {
        if (!result) {
          return result;
        }

        if (isBulkInsert) {
          return result.map(convertToResponse(schema, __fields));
        }

        return convertToResponse(schema, __fields)(result);
      })
      .then(resolve)
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}

function bulkCreate(middleware, tableName, params = [], fields, trx) {
  return middleware(tableName)
    .insert(params)
    .returning(...fields)
    .transacting(trx)
    .then(function(ids = []) {
      const max = ids.reduce((max, id) => max < id ? id : max, 0);
      return middleware
        .raw(`ALTER SEQUENCE "${ tableName }_id_seq" RESTART WITH ${ max };`)
        .then(() => ids);
    });
}