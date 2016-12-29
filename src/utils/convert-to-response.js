import dot from 'dot-object';
import isPlainObject from 'lodash.isplainobject';
import checkConvertOut from './check-convert-out';

export default function convertToResponse(schema, fields) {
  const convertOuts = checkConvertOut(schema.properties);

  return resultData => {
    if (isPlainObject(resultData) || resultData.constructor.name === 'anonymous') {
      let result = {};
      let names = Object.keys(resultData);

      for (let dbName of names) {
        let name = schema.dbProperties[ dbName ].name;
        let value = resultData[ dbName ];

        if (dbName in convertOuts) {
          value = callback(value, schema.properties[ name ]);
        }

        result = dot.str(name, value, result);
      }

      return result;
    } else {
      let result = {};
      // Берем первое указанное имя в fields, по идее оно там одно
      let key = fields[ 0 ];
      let value = resultData[ 0 ] || resultData;

      if (key in convertOuts) {
        value = callback(value, schema.dbProperties[ key ].name);
      }

      result = dot.str(key, value, result);
      return result;
    }
  };
}