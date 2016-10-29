import isEmpty from 'lodash.isempty';
import setCriteria from './../utils/set-criteria';
import setParams from './../utils/set-params';
import {buildFindOne} from './find/one';
import {buildCount} from './count';
import {ERROR_UPDATE, ERROR_FIND_ONE} from './constants';

export default (middleware, micro, plugin) =>
  (schema, criteria, params, options) =>
    buildUpdate(middleware, schema, criteria, params, options);

export function buildUpdate (middleware, schema, criteria = {}, params = {}, options = {}) {
  const {
    sql = false
  } = options;

  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    if (isEmpty(criteria)) {
      return resolve(null);
    }

    const table = middleware(schema.tableName);
    const builder = setCriteria(table, criteria, reject)
      .update(setParams(schema, params, reject));

    if (sql) {
      return resolve(builder.toSQL());
    }

    // Узнаем кол-во обновляемых строк
    buildCount(middleware, schema, criteria)
      .then(({ count }) => {
        // Если равно 0 - то и обновлять не стоит
        if (count === 0) {
          return null;
        }

        return builder
          .then(findUpdated)
          .catch(error => {
            reject(error.code === ERROR_FIND_ONE ? error : {
              code   : ERROR_UPDATE,
              message: error.detail
            });
          });
      })
      .then(resolve)
      .catch(reject);
  });

  function findUpdated(affectedRows) {
    // Если ничего не обновилось
    if (affectedRows === 0) {
      return null;
    }

    // Запросим элемент
    return buildFindOne(middleware, schema, criteria, options);
  }
}