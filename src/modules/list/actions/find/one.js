import isEmpty from 'lodash.isempty';
import Schema from './../../../../utils/schema';
import setCriteria from './../../../../utils/set-criteria';
import checkConvertOut from './../../../../utils/check-convert-out';
import { MODULE_NAME } from './../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-one' };

export default (app, middleware, plugin) => (msg) => buildFindOne(app, middleware, msg);

export function buildFindOne(app, middleware, { schema, criteria = {}, options = {} }) {
  const { transaction, outer = false, fields } = options;
  const convertOuts = checkConvertOut(schema.properties);

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    if (isEmpty(criteria)) {
      return resolve(null);
    }

    let builder = setCriteria(app, middleware(schema.tableName), criteria, reject)
      .select(...schema.getMyFields(fields))
      .limit(1);
    /*
    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }
    */
    if (/*transaction || */outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
    }

    // Иначе вызовем его выполнение
    builder
      .then(([ result ]) => {
        if(!result) {
          resolve(null);
        }

        for (let { name, callback } of convertOuts) {
          result[ name ] = callback(result[ name ], schema.properties[ name ]);
        }

        resolve({ ...result });
      })
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}