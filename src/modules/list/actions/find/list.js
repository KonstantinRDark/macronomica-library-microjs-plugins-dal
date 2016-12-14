import isString from 'lodash.isstring';
import Schema from './../../../../utils/schema';
import isNumber from 'lodash.isnumber';
import setCriteria from './../../../../utils/set-criteria';
import checkConvertOut from './../../../../utils/check-convert-out';
import { MODULE_NAME } from './../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-list' };

export default (app, middleware, plugin) => (msg) => buildFindList(app, middleware, msg);

export function buildFindList(app, middleware, { schema, criteria = {}, options = {} }) {
  const {
    transaction,
    outer = false,
    fields,
    sort = 'id',
    limit,
    offset,
  } = options;

  const convertOuts = checkConvertOut(schema.properties);

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let builder = setCriteria(
      app,
      middleware(schema.tableName),
      schema.getMyParams(criteria),
      reject
    ).select(...schema.getMyFields(fields));

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
    /*
    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }
    */
    if (/*transaction || */outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    builder
      .then((result = []) => {
        if (convertOuts.length > 0) {
          result = result.map(item => {

            for (let { name, callback } of convertOuts) {
              item[ name ] = callback(item[ name ], schema.properties[ name ]);
            }

            return item;
          });
        }

        resolve(result.map(row => ({ ...row })));
      })
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}