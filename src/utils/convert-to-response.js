import dot from 'dot-object';
import isPlainObject from 'lodash.isplainobject';
import checkConvertOut from './check-convert-out';

export default function convertToResponse(schema, fields) {
  return resultData => {
    if (isPlainObject(resultData) || resultData.constructor.name === 'anonymous') {
      let result = {};
      let names = Object.keys(resultData);

      for (let dbName of names) {
        let name = schema.dbProperties[ dbName ].name;
        let property = schema.properties[ name ];
        let value = resultData[ dbName ];

        if ('convertOut' in property.type) {
          value = property.type.convertOut(value, property);
        }

        result = dot.str(name, value, result);
      }

      return result;
    } else {
      let result = {};
      // Берем первое указанное имя в fields, по идее оно там одно
      let dbName = fields[ 0 ];
      let value = resultData[ 0 ] || resultData;
      let name = schema.dbProperties[ dbName ].name;
      let property = schema.properties[ name ];
      
      if ('convertOut' in property.type) {
        value = property.type.convertOut(value, property);
      }

      result = dot.str(name, value, result);
      return result;
    }
  };
}