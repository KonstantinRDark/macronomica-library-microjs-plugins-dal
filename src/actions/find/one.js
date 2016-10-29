import isEmpty from 'lodash.isempty';
import setCriteria from './../../utils/set-criteria';
import {ERROR_FIND_ONE} from './../constants';

export default (middleware, micro, plugin) =>
  (schema, criteria = {}, options) =>
    buildFindOne(middleware, schema, criteria, options);

export function buildFindOne(middleware, schema, criteria = {}, { fields, sql = false } = {}) {
  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);
    
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
        resolve(!result ? null : { ...result });
      })
      .catch(error => {
        reject({
          code   : ERROR_FIND_ONE,
          message: error.detail
        });
      });
  });
}