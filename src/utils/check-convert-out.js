import memoize from 'lodash.memoize';
import isFunction from 'lodash.isfunction';

export default memoize(properties => {
  const keys = Object.keys(properties);
  const result = [];

  for (let key of keys) {
    let convertOut = properties[ key ].type.convertOut;

    if (isFunction(convertOut)) {
      result.push({ name: key, callback: convertOut });
    }
  }


  return result;
});