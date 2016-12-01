import setParams from './../../../utils/set-params';
import Schema from './../../../utils/schema';
import { MODULE_NAME } from './../constants';
import {
  internalError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'create' };

export default (app, middleware, plugin) => (msg) => buildCreate(app, middleware, msg);

export function buildCreate (app, middleware, { schema, params = {}, options = {} }) {
  const { transaction, outer = false, fields } = options;
  const isBulkInsert = Array.isArray(params);

  if (!params) {
    return Promise.resolve(null);
  }

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
        builder = bulkCreate(app, middleware, schema, params, fields, transaction, reject);
      } else {
      */
        // Создаем свою
        builder = middleware.transaction(trx => bulkCreate(app, middleware, schema, params, fields, trx, reject)
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
        .returning(...schema.getMyFields(fields));
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
      .then(resolve)
      .catch(internalError(app, ERROR_INFO))
      .catch(reject);
  });
}

function bulkCreate(app, middleware, schema, params, fields, trx, reject) {
  return middleware(schema.tableName)
    .insert(params.map(params => setParams(app, schema, params, reject)))
    .returning(...schema.getMyFields(fields))
    .transacting(trx)
    .then(function(ids) {
      const max = ids.reduce((max, id) => max < id ? id : max, 0);
      return middleware
        .raw(`ALTER SEQUENCE ${ schema.tableName }_id_seq RESTART WITH ${ max };`)
        .then(() => ids);
    });
}