import setParams from './../../../utils/set-params';
import convertToResponse from './../../../utils/convert-to-response';
import Schema from './../../../utils/schema';
import { MODULE_NAME } from './../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'create' };

export default (app, middleware, plugin) => (msg) => buildCreate(app, middleware, msg);

export function buildCreate (app, middleware, { schema, params, options = {} }) {
  const { transaction, outer = false, fields } = options;
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

    // Создание множества записей
    if (isBulkInsert) {
      /*
      if (transaction) {
        // Если передали внешнюю транзакцию - привяжемся к ней
        builder = bulkCreate(app, middleware, schema, params, __fields, transaction, reject);
      } else {
      */
        // Создаем свою
        builder = middleware.transaction(trx => bulkCreate(app, middleware, schema, params, __fields, trx, reject)
          .then(trx.commit)
          .catch(trx.rollback)
        );
      /*
      }
      */
    }
    // Создание одной записи
    else {
      builder = middleware(schema.tableName)
        .insert(setParams(app, schema, params, reject))
        .returning(...__fields);
      /*
      if (transaction) {
        // Если передали внешнюю транзакцию - привяжемся к ней
        builder = builder.transacting(transaction);
      }
      */
    }

    if (/*transaction ||*/ outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
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

function bulkCreate(app, middleware, schema, params = [], fields, trx, reject) {
  return middleware(schema.tableName)
    .insert(params.map(params => setParams(app, schema, params, reject)))
    .returning(...fields)
    .transacting(trx)
    .then(function(ids = []) {
      const max = ids.reduce((max, id) => max < id ? id : max, 0);
      return middleware
        .raw(`ALTER SEQUENCE "${ schema.tableName }_id_seq" RESTART WITH ${ max };`)
        .then(() => ids);
    });
}