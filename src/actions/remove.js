import isEmpty from 'lodash.isempty';
import setCriteria from './../utils/set-criteria';
import { ERROR_REMOVE } from './constants';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildRemove(middleware, schema, params, options);

export function buildRemove (middleware, schema, criteria = {}) {
  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);
    
    if (isEmpty(criteria)) {
      return resolve(null);
    }
    
    const table = middleware(schema.tableName);
    const builder = setCriteria(table, criteria, reject)
      .del()
      .returning('id');

    builder
      .then(resolve)
      .catch(error => {
        reject({
          code   : ERROR_REMOVE,
          message: error.detail
        });
      });
  });
}