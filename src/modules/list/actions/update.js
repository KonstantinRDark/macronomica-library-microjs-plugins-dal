import TypedError from 'error/typed';
import isEmpty from 'lodash.isempty';
import Schema from './../../../utils/schema';
import setCriteria from './../../../utils/set-criteria';
import convertToResponse from './../../../utils/convert-to-response';
import { PIN_LIST_COUNTS } from '../../../pins';
import { MODULE_NAME } from './../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'update' };
const SetParamsInternalError = TypedError({
  message: '{name} - параметры для создания записи не корректны',
  type   : 'micro.plugins.dal.schema.set-params.params.not.correct',
  code   : 500
});

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
    criteria = schema.getMyCriteriaParams(criteria);

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

        let __params;

        try {
          __params = schema.setParams(params);
        } catch (e) {
          if (e.type === 'micro.plugins.dal.schema.validate.error') {
            return reject(e);
          }

          app.log.error(e);
          return reject(SetParamsInternalError());
        }

        let builder = setCriteria(app, middleware(schema.tableName), criteria, reject)
          .update(__params)
          .returning(...__fields);

        if (outer) {
          // Если кто-то сам хочет запускать запрос - вернем builder
          // Возвращаем как объект - иначе происходит исполнение данного builder'a
          return resolve({ builder });
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
          .catch(internalErrorPromise(app, ERROR_INFO));
      })
      .then(resolve)
      .catch(reject);
  });
}