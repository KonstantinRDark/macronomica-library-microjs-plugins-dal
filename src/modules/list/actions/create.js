import setParams from './../../../utils/set-params';
import { ERROR_CREATE, ERROR_FIND_ONE } from './../../../constants';

export default (app, middleware, plugin) => (msg) => buildCreate(app, middleware, plugin, msg);

export function buildCreate (app, middleware, plugin, { schema:schemaName, params = {}, options = {} }) {
  const { transaction, outer = false, fields } = options;
  const isBulkInsert = Array.isArray(params);

  if (!params) {
    return Promise.resolve(null);
  }

  return plugin
    .schema(schemaName)
    .then(schema => new Promise((resolve, reject) => {
      let builder;

      // Создание множества записей
      if (isBulkInsert) {
        if (transaction) {
          // Если передали внешнюю транзакцию - привяжемся к ней
          builder = bulkCreate(middleware, schema, params, fields, transaction, reject);
        } else {
          // Создаем свою
          builder = middleware.transaction(trx => bulkCreate(middleware, schema, params, fields, trx, reject)
            .then(trx.commit)
            .catch(trx.rollback)
          );
        }
      }
      // Создание одной записи
      else {
        builder = middleware(schema.tableName)
          .insert(setParams(schema, params, reject))
          .returning(...schema.getMyFields(fields));

        if (transaction) {
          // Если передали внешнюю транзакцию - привяжемся к ней
          builder = builder.transacting(trx);
        }
      }

      if (transaction || outer) {
        // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
        resolve(builder);
      } else {
        // Иначе вызовем его выполнение
        builder
          .then(resolve)
          .catch(error => {
            reject(error.code === ERROR_FIND_ONE ? error : new Error(ERROR_CREATE));
          });
      }
    }));
}

function bulkCreate(middleware, schema, params, fields, trx, reject) {
  return middleware(schema.tableName)
    .insert(params.map(params => setParams(schema, params, reject)))
    .returning(...schema.getMyFields(fields))
    .transacting(trx)
    .then(function(ids) {
      const max = ids.reduce((max, id) => max < id ? id : max, 0);
      return middleware
        .raw(`ALTER SEQUENCE ${ schema.tableName }_id_seq RESTART WITH ${ max };`)
        .then(() => ids);
    });
}