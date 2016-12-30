import memoize from 'lodash.memoize';
import isFunction from 'lodash.isfunction';

export default (name, properties) => {
  const keys = Object.keys(properties);
  const result = { keys: [] };

  for (let key of keys) {
    let property = properties[ key ];
    if (!('link' in property) || !(name in property.link)) {
      continue;
    }
    result.keys.push(key);
    result[ key ] = property.link[ name ];
  }

  return result;
};
