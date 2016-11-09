import isEmpty from 'lodash.isempty';
import isString from 'lodash.isstring';
import setCriteria from './../../utils/set-criteria';
import checkArray from './../../utils/check-array';
import { ERROR_FIND_ONE } from './../constants';

export default (middleware, micro, plugin) =>
  (schema, criteria = {}, options) =>
    buildFindOne(middleware, schema, criteria, options);

export function buildFindOne(middleware, schema, criteria = {}, { fields, sql = false } = {}) {
  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);
    const manyLinks = checkArray(schema.properties);

    if (isEmpty(criteria)) {
      return resolve(null);
    }

    const table = middleware(schema.tableName);
    const builder = setCriteria(table, criteria, reject)
      .select(...schema.getMyFields(fields))
      .limit(1);

    if (sql) {
      return resolve(builder.toSQL());
    }

    builder
      .then(([ result ] = []) => {
        if(!result) {
          resolve(null);
        }

        manyLinks.forEach(name => {
          if (name in result && !!result[ name ] && isString(result[ name ])) {
            result[ name ] = result[ name ].split(',');
          }
        });

        resolve({ ...result });
      })
      .catch(error => {
        reject({
          code   : ERROR_FIND_ONE,
          message: error.detail || error.message.split(' - ')[ 1 ]
        });
      });
  });
}