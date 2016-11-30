import isPlainObject from 'lodash.isplainobject';
import isFunction from 'lodash.isfunction';
import criteria from './criteria';
import sqlStringProtector from './sql-string-protector';

export default (builder, params, reject) => {
  const { or = [], ...and } = params;

  return builder
    .where(addWhere(and))
    .andWhere(function() {
      const builder = this;
      or.forEach(params => builder.orWhere(addWhere(params)));
    });

  function addWhere(obj) {
    return function () {
      const builder = this;
      setWhere(builder, obj, reject);
    };
  }
};

function setWhere(builder, params, reject) {
  const keys = Object.keys(params);

  for(let property of keys) {
    const value = params[ property ];

    if (isPlainObject(value)) {
      Object
        .keys(value)
        .forEach(key => {
          const criteriaCallback = criteria[ key.toLowerCase() ];

          if (isFunction(criteriaCallback)) {
            builder = criteriaCallback(builder, property, value[ key ]);
          }
        });
    } else {
      
      if (!sqlStringProtector(value)) {
        reject({
          code   : 'detected.sql.injection',
          message: `При запросе обнаружена SQL-Injection в свойстве {${ property }: "${ value }"` });
        break;
      }

      builder = builder.where(property, value);
    }
  }

  return builder;
}