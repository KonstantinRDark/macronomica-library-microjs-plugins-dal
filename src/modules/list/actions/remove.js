import isEmpty from 'lodash.isempty';
import Schema from './../../../utils/schema';
import setCriteria from './../../../utils/set-criteria';
import convertToResponse from './../../../utils/convert-to-response';
import { MODULE_NAME } from './../constants';
import {
  internalError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'remove' };

export default (app, middleware, plugin) => (msg) => buildRemove(app, middleware, msg);

export function buildRemove (app, middleware, { schema, criteria = {}, options = {} }) {
  const { transaction, outer = false, fields } = options;
  const __fields = schema.getMyFields(fields);

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
      .del()
      .returning(__fields);
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

    builder
      .then(result => {
        if(!result) {
          return result;
        }

        if (Array.isArray(result)) {
          return result.map(convertToResponse(schema, __fields));
        }

        return convertToResponse(schema, __fields)([ result ]);
      })
      .then(resolve)
      .catch(internalError(app, ERROR_INFO))
      .catch(reject);
  });
}