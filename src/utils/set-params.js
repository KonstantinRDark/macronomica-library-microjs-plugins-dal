import sqlStringProtector from './sql-string-protector';
import detectedSqlInjectionError from './../errors/detected-sql-injection-error';

const ERROR_INFO = { module: 'utils', action: 'set-params' };

export default (app, schema, params = {}, reject) => {
  const keys = Object.keys(params);
  const result = {};
  
  for(let property of keys) {
    const value = params[ property ];
    
    if (!sqlStringProtector(value)) {
      reject(detectedSqlInjectionError(app, { ...ERROR_INFO, property, value }));
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