import dot from 'dot-object';
import isString from 'lodash.isstring';
import Schema from './../../../../utils/schema';
import isNumber from 'lodash.isnumber';
import setCriteria from './../../../../utils/set-criteria';
import checkLinks from './../../../../utils/check-links';
import convertToResponse from './../../../../utils/convert-to-response';
import { MODULE_NAME } from './../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-list' };

export default (app, middleware, plugin) => (msg) => buildFindList(app, middleware, msg);

export function buildFindList(app, middleware, msg) {
  let { schema, criteria = {}, options = {} } = msg;
  const {
    outer = false,
    fields,
    sort = 'id',
    limit,
    offset,
  } = options;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let __fields = schema.getMyFields(fields);
    let builder = setCriteria(
      app,
      middleware(schema.tableName),
      schema.getMyCriteriaParams(criteria),
      reject
    ).select(...__fields);

    if (sort) {
      let orderKey;
      let orderDirection;

      if (isString(sort)) {
        [ orderKey, orderDirection = 'asc' ] = sort.split(' ');

        orderDirection = [ 'asc', 'desc' ].includes(orderDirection.toLowerCase())
          ? orderDirection.toLowerCase()
          : 'asc';
      }

      if (orderKey && orderDirection) {
        builder = builder.orderBy(orderKey, orderDirection);
      }
    }

    if (limit && isNumber(limit)) {
      builder = builder.limit(limit);
    }

    if (offset && isNumber(offset)) {
      builder = builder.offset(offset);
    }

    if (outer) {
      // Если кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    builder
      .then((result = []) => {
        if (!result || !Array.isArray(result)) {
          return result;
        }

        const records = result.map(convertToResponse(schema, __fields));

        return schema
          .assignLinksToMany(records, pin => msg.act(pin))
          .then(() => records);
      })
      .then(resolve)
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}