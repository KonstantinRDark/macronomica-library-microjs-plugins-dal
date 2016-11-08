import setParams from './../utils/set-params';
import checkArray from './../utils/check-array';
import { ERROR_CREATE, ERROR_FIND_ONE } from './constants';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildCreate(middleware, schema, params, options);

export function buildCreate (middleware, schema, params = {}, options = {}) {
  const isBulkInsert = Array.isArray(params);
  const manyLinks = checkArray(schema.properties);

  manyLinks.forEach(name => {
    if (name in params && Array.isArray(params[ name ])) {
      params[ name ] = params[ name ].join(',');
    }
  });

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
      .then(resolve)
      .catch(error => {
        reject(error.code === ERROR_FIND_ONE ? error : {
          code   : ERROR_CREATE,
          message: error.detail || error.message.split(' - ')[ 1 ]
        });
      });
  });
}