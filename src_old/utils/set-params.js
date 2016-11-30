import sqlStringProtector from './sql-string-protector';

export default (schema, params, reject) => {
  const keys = Object.keys(params);
  const result = {};
  
  for(let property of keys) {
    const value = params[ property ];
    
    if (!sqlStringProtector(value)) {
      reject({
        code   : 'detected.sql.injection',
        message: `При запросе обнаружена SQL-Injection в свойстве {${ property }: "${ value }"`
      });
      break;
    }

    if (!schema.has(property)) {
      continue;
    }
    
    let valid = schema.validate(property, value);
    
    if (valid.error) {
      reject(valid.error);
      break;
    }
    
    result[ property ] = valid.value;
  }
  
  return result;
};