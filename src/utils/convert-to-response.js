import isPlainObject from 'lodash.isplainobject';
import checkConvertOut from './check-convert-out';

export default function convertToResponse(schema, fields) {
  const convertOuts = checkConvertOut(schema.properties);

  return result => {
    if (isPlainObject(result)) {
      for (let { name, callback } of convertOuts) {
        result[ name ] = callback(result[ name ], schema.properties[ name ]);
      }

      return result;
    } else {
      let key = fields[ 0 ];
      let value = result[ 0 ] || result;

      for (let { name, callback } of convertOuts) {
        if (key === name) {
          value = callback(value, schema.properties[ name ]);
          break;
        }
      }

      return { [ key ]: value };
    }
  };
}