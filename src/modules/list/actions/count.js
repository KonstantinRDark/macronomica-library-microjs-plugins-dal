import Schema from './../../../utils/schema';
import setCriteria from './../../../utils/set-criteria';
import { MODULE_NAME } from './../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'count' };

export default (app, middleware, plugin) => (msg) => buildCount(app, middleware, msg);

export function buildCount (app, middleware, { schema, criteria = {}, options = {} }) {
  const {
    transaction,
    outer = false
  } = options;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    let builder = setCriteria(app, middleware(schema.tableName), criteria, reject).count();

    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }

    if (transaction || outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
    }

    return builder
      // Заглушка count(*) для sqllite3
      .then(([ result ]) => ({ count: result.count || result[ 'count(*)' ] }))
      .then(resolve)
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}