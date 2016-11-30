import setCriteria from './../utils/set-criteria';
import { ERROR_COUNT } from '../../../constants';

export default (middleware, micro, plugin) =>
  (schema, criteria, options) =>
    buildCount(middleware, schema, criteria, options);

export function buildCount (middleware, schema, criteria = {}, { sql = false } = {}) {
  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    const table = middleware(schema.tableName);

    const builder = setCriteria(table, criteria, reject)
      .count();

    if (sql) {
      return resolve(builder.toSQL());
    }

    return builder
      .then(([ { count } ]) => {
        return { count: +count };
      })
      .then(resolve)
      .catch(error => {
        reject({
          code   : ERROR_COUNT,
          message: error.detail || error.message.split(' - ')[ 1 ]
        });
      });
  });
}