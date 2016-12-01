import isEmpty from 'lodash.isempty';
import Schema from './../../../utils/schema';
import setCriteria from './../../../utils/set-criteria';
import setParams from './../../../utils/set-params';
import convertToResponse from './../../../utils/convert-to-response';
import { PIN_LIST_COUNTS } from '../../constants';
import { MODULE_NAME } from './../constants';
import {
  internalError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'update' };

export default (app, middleware, plugin) => (msg) => buildUpdate(app, middleware, msg);

export function buildUpdate (app, middleware, { schema, criteria = {}, params = {}, options = {} }) {
  const { transaction, outer = false, fields } = options;
  const __fields = schema.getMyFields(fields);

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
    criteria = schema.getMyParams(criteria);

    if (isEmpty(criteria)) {
      return resolve(null);
    }

    // Узнаем кол-во обновляемых строк
    app
      .act({ ...PIN_LIST_COUNTS, schema, criteria })
      .then(({ count }) => {
        // Если равно 0 - то и обновлять не стоит
        if (count === 0) {
          return null;
        }

        let builder = setCriteria(app, middleware(schema.tableName), criteria, reject)
          .update(setParams(app, schema, params, reject))
          .returning(...__fields);
        /*
        if (transaction) {
          // Если передали внешнюю транзакцию - привяжемся к ней
          builder = builder.transacting(transaction);
        }
        */
        if (/*transaction || */outer) {
          // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
          return builder;
        }

        return builder
          .then(result => {
            if (!result) {
              return result;
            }

            if (Array.isArray(result)) {
              return result.map(convertToResponse(schema, __fields));
            }

            return convertToResponse(schema, __fields)(result);
          })
          .catch(internalError(app, ERROR_INFO));
      })
      .then(resolve)
      .catch(reject);
  });
}