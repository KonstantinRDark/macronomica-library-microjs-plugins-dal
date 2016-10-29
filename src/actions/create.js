import setParams from './../utils/set-params';
import {buildFindList} from './find/list';
import {buildFindOne} from './find/one';
import {ERROR_CREATE, ERROR_FIND_ONE} from './constants';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildCreate(middleware, schema, params, options);

export function buildCreate (middleware, schema, params = {}, options = {}) {
  const isBulkInsert = Array.isArray(params);

  return new Promise((resolve, reject) => {
    if (!params) {
      return;
    }
    let builder;
    
    if (isBulkInsert) {
      builder = middleware.transaction(trx => {
          middleware(schema.tableName)
            .insert(params.map(params => setParams(schema, params, reject)))
            .returning('id')
            .transacting(trx)
            .then(function(ids) {
              const max = ids.reduce((max, id) => max < id ? id : max, 0);
              return middleware
                .raw(`ALTER SEQUENCE ${ schema.tableName }_id_seq RESTART WITH ${ max };`)
                .then(() => ids);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        });
    } else {
      builder = middleware(schema.tableName)
        .insert(setParams(schema, params, reject))
        .returning('id');
    }

    builder
      .then((ids = []) => {
        if (!ids.length) {
          return null;
        }

        if (isBulkInsert) {
          return buildFindList(middleware, schema, { id: { in: ids } }, options);
        } else {
          return buildFindOne(middleware, schema, { id: ids[ 0 ] }, options);
        }
      })
      .then(resolve)
      .catch(error => {
        reject(error.code === ERROR_FIND_ONE ? error : {
          code   : ERROR_CREATE,
          message: error.detail
        });
      });
  });
}