import isEmpty from 'lodash.isempty';
import setCriteria from './../../utils/set-criteria';
import checkConvertOut from './../../utils/check-convert-out';
import { ERROR_FIND_ONE } from '../../../../constants';

export default (middleware, micro, plugin) =>
  (schema, criteria = {}, options) =>
    buildFindOne(middleware, schema, criteria, options);

export function buildFindOne(middleware, schema, criteria = {}, { fields, sql = false } = {}) {
  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);
    const convertOuts = checkConvertOut(schema.properties);

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

        for (let { name, callback } of convertOuts) {
          result[ name ] = callback(result[ name ], schema.properties[ name ]);
        }

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