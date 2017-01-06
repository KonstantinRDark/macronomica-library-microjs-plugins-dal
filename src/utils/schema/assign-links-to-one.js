import dot from 'dot-object';
import SchemaTypes from './../schema-types';

export default (schema) => (record, exec) => {
  const properties = schema.properties;
  const propertiesNames = schema.__propertiesNames;
  const promises = [];
  
  for (let propertyName of propertiesNames) {
    let property = properties[ propertyName ];
    let hasMany = property.type === SchemaTypes.array;
    let name = hasMany ? 'list' : 'one';
    
    if (!!property.link && name in property.link) {
      promises.push(__assignLink(propertyName, hasMany, property.link[ name ]));
    }
  }
  
  if (!promises.length) {
    return Promise.resolve(record);
  }
  
  // Получаем все связанные объекты и сетим их себе
  return Promise.all(promises).then(() => record);
  
  function __assignLink(propertyName, hasMany, pin) {
    const name = !!~propertyName.lastIndexOf('.')
      ? propertyName.slice(0, propertyName.lastIndexOf('.'))
      : propertyName;
    const criteria = {};
    const value = dot.pick(propertyName, record);
    
    if (hasMany) {
      criteria.id = { in: value };
    } else {
      criteria.id = value;
    }
    
    return exec({ ...pin, criteria })
      .then(link => {
        if (hasMany) {
          record[ name ] = link;
        } else {
          Object.assign(record[ name ], link);
        }
        
        return record;
      });
  }
};