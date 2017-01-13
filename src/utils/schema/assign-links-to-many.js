import dot from 'dot-object';
import SchemaTypes from './../schema-types';

export default (schema) => (records, exec) => {
  const properties = schema.properties;
  const links = schema.__assignLinksMany;
  
  if (!links.keys.length) {
    return Promise.resolve(records);
  }
  
  const criteria = records.reduce((result, record) => {
    
    for(let propertyName of links.keys) {
      let property = properties[ propertyName ];
      let hasMany = property.type === SchemaTypes.array;
      let value = dot.pick(propertyName, record);
      
      if (value === undefined || (hasMany && Array.isArray(value) && !value.length)) {
        continue;
      }
      
      let data = result[ propertyName ] = result[ propertyName ] || {
          list: [],
          map : hasMany ? new WeakMap() : new Map(),
        };
      
      if (!data.map.has(value)) {
        data.list.push(value);
        data.map.set(value, []);
      }
      
      data.map.get(value).push(record);
    }
    
    return result;
  }, {});
  
  // Получаем все связанные объекты и сетим их себе
  return Promise
    .all(Object.keys(criteria).map(propertyName => {
      let name = !!~propertyName.lastIndexOf('.')
        ? propertyName.slice(0, propertyName.lastIndexOf('.'))
        : propertyName;
      let hasMany = properties[ propertyName ].type === SchemaTypes.array;
      let list = criteria[ propertyName ].list;
      let map = criteria[ propertyName ].map;
      
      if (!list.length) {
        return Promise.resolve();
      }
      
      const pin = links[ propertyName ];
      
      return hasMany ? Promise.all(list.map(loadOne)) : loadOne(list);
      
      function loadOne(list) {
        return exec({ ...pin, criteria: { id: { in: list } } })
          .then(recordsLinks => recordsLinks.map(link => map.get(hasMany ? list : link.id).map(record => {
            if (hasMany) {
              let innerList = dot.pick(name, record);
              innerList.forEach((id, i) => {
                if (link.id === id) {
                  innerList[ i ] = link;
                }
              });
            }
            else {
              Object.assign(dot.pick(name, record), link);
            }
      
            return record;
          })));
      }
    }))
    .then(() => records);
};