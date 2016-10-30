import Joi from 'joi';
import SchemaTypes from './schema-types';

export const Types = SchemaTypes;

export default class Schema {
  tableName = undefined;
    
  constructor(modelName, properties = { }, { tableName } = { }) {
    this.tableName = tableName || getTableName(modelName);
    this.properties = {
      id: {
        type         : SchemaTypes.number,
        autoincrement: true
      },
      ...properties
    };
  }
  
  getMyFields = (fields = [ 'id' ]) => fields.reduce((fields, name) => {
    if (this.has(name)) {
      fields.push(name);
    }
    return fields;
  }, []);
  
  getMyParams = (params = {}) => Object.keys(params).reduce((result, name) => {
    if (this.has(name)) {
      result[ name ] = params[ name ];
    }
    return params;
  }, {});
  
  has = (property) => {
    return !!this.properties[ property ];
  };

  validate = (property, value) => {
    const props = this.properties[ property ];
    if (!props) { return false }
    
    if ('null' in props && Boolean(props.null) === true && value === null) {
      return {
        value,
        error: undefined
      };
    }
    
    const valid = Joi.validate(value, props.type.schema(props));
  
    if (valid.error) {
      return {
        value: valid.value,
        error: {
          code   : 'error.dal.params',
          message: `${ property }: ${ valid.error.message }`
        }
      };
    }
  
    return valid;
  };
  
  migrateCreateTableSchema = () => {
    const fields = Object.keys(this.properties);
    const result = {};

    for(let name of fields) {
      let options = this.properties[ name ];

      if (name === 'id') {
        result[ name ] = { type: 'int', primaryKey: true, autoIncrement: true, notNull: true };
        continue;
      }

      let type;
      
      switch (options.type.value) {
        case 'date' : { type = 'date'; break }
        case 'text' : { type = 'text'; break }
        case 'float' : { type = 'float'; break }
        case 'money' : { type = 'decimal'; break }
        case 'number' :
        case 'integer': { type = 'int'; break }
        case 'string' : { type = 'string'; break }
        case 'boolean': { type = 'boolean'; break }
        case 'smallint': { type = 'smallint'; break }
        case 'datetime': { type = 'datetime'; break }
      }
      
      if (!type) { continue }
      
      let params = { type };

      params.notNull = !(options.null === true);

      if ('unique' in options) {
        params.unique = options.unique === true;
      }

      result[ name ] = params;
    }
    
    return result;
  }
}

/**
 * @param {string} name
 * @returns {string}
 */
function getTableName(name) {
  return name.toLocaleLowerCase();
}