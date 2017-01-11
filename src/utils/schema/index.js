import Joi from 'joi';
import WrappedError from 'error/wrapped';
import TypedError from 'error/typed';
import dot from 'dot-object';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import isBoolean from 'lodash.isboolean';
import uniq from 'lodash.uniq';

import SchemaTypes from './../schema-types';
import assignLinksToOne from './assign-links-to-one';
import assignLinksToMany from './assign-links-to-many';
import sqlStringProtector from './../sql-string-protector';

const PropertyMustBeType = TypedError({
  message     : '{name} - свойство "{propertyName}" должно быть "{propertyType}"',
  type        : 'micro.plugins.dal.schema.property.must.be.type',
  code        : 400,
  propertyName: null,
  propertyType: null
});

const DetectedSqlInjectionError = TypedError({
  message      : '{name} - обнаружена потенциальная SQL инъекция в свойстве "{propertyName}"',
  type         : 'micro.plugins.dal.schema.detected.sql.injection',
  code         : 500,
  propertyName : null,
  propertyValue: null
});

const ValidateError = WrappedError({
  message      : '{name} - ошибка валидации свойства {propertyName} - {origMessage}',
  type         : 'micro.plugins.dal.schema.validate.error',
  code         : 400,
  propertyName : null,
  propertyValue: null
});

export const Types = SchemaTypes;
export const FIELDS_MASK = [ 'full' ];

export default class Schema {
  tableName = undefined;
  
  constructor(modelName, properties = { }, { tableName, fieldsMask } = { }) {
    if (!isString(modelName)) {
      throw PropertyMustBeType({ propertyName: 'modelName', propertyType: 'string' });
    }
    
    if (fieldsMask !== undefined
      && (!Array.isArray(fieldsMask) || fieldsMask.some(name => !isString(name)))
    ) {
      throw PropertyMustBeType({ propertyName: 'fieldsMask', propertyType: 'array<string>' });
    }
    
    if (!isString(tableName)) {
      throw PropertyMustBeType({ propertyName: 'tableName', propertyType: 'string' });
    }
  
    let schema = this;
    schema.fieldsMask = uniq([ ...FIELDS_MASK, ...(fieldsMask || []) ]);
    schema.tableName = (tableName || getTableName(modelName)).replace(/-/g, '_');
    schema.dbProperties = {};
    
    schema.properties = {
      id: {
        type         : SchemaTypes.number,
        name         : 'id',
        dbName       : 'id',
        autoincrement: true
      },
      ...(Object
        .keys(properties)
        .reduce((properties, name) => {
          let dbName = nameToDbName(name);
          this.dbProperties[ dbName ] = Object.assign(properties[ name ], { name, dbName });
          return properties;
        }, properties))
    };
    schema.dbProperties.id = schema.properties.id;
    schema.__propertiesNames = Object.keys(schema.properties);
    schema.__masks = getFieldsMask(schema.__propertiesNames, schema.properties, schema.fieldsMask);
    
    schema.__assignLinksMany = schema.__propertiesNames.reduce((result, propertyName) => {
      let property = schema.properties[ propertyName ];
      let name = 'list';
  
      if ('link' in property && name in property.link) {
        result.keys.push(propertyName);
        result[ propertyName ] = property.link[ name ];
      }
  
      return result;
    }, { keys: [] });
  }
  
  getMyFields = (fields) => {
    // Если в свойстве fields строка - берем заранее заготовленный список пло маске
    if (isString(fields)) {
      if (!!this.__masks[ fields ]) {
        return this.__masks[ fields ];
      }
      
      fields = undefined;
    }
    
    if (fields === undefined) {
      fields = [ 'id' ];
    }
    
    if (Array.isArray(fields)) {
      return fields.reduce((fields, name) => {
        if (this.has(name)) {
          fields.push(name);
        }
        return fields;
      }, []);
    }
  };
  
  setParams = (params) => {
    let schema = this;
    let names = Object.keys(schema.properties);
    let result = {};
    
    for(let propertyName of names) {
      let property = schema.properties[ propertyName ];
      let value = dot.pick(propertyName, params) || dot.pick(property.dbName, params);
      
      if (value === undefined) {
        continue;
      }
      
      if (!sqlStringProtector(value)) {
        throw DetectedSqlInjectionError({ propertyName, propertyValue: value });
      }
      
      if ('convertIn' in property.type) {
        value = property.type.convertIn(value, property);
      }
      
      let valid = schema.validate(propertyName, value);
      
      if (valid.error) {
        throw valid.error;
      }
      
      result[ property.dbName ] = valid.value;
    }
    
    return result;
  };
  
  getMyCriteriaParams = (params = {}) => {
    let schema = this;
    let result = Object.keys(schema.properties).reduce(reduce, {});
    return result;
    
    function reduce(result, propertyName) {
      let property = schema.properties[ propertyName ];
      let value = dot.pick(propertyName, params) || dot.pick(property.dbName, params);
      
      if (value !== undefined) {
        result[ property.dbName ] = value;
      }
      
      return result;
    }
  };
  
  has = (property) => {
    return isString(property) && !!this.properties[ property ];
  };
  
  validate = (propertyName, value) => {
    const props = this.properties[ propertyName ];
    if (!props) { return false }
    
    if ('null' in props && props.null === true && (value === null || value === '')) {
      return {
        value,
        error: undefined
      };
    }
    
    const valid = Joi.validate(value, props.type.schema(props));
    
    if (valid.error) {
      valid.error = ValidateError(valid.error, { propertyName, propertyValue: value });
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
        case 'float' : { type = 'decimal'; break }
        case 'money' : { type = 'decimal'; break }
        case 'number' :
        case 'integer': { type = 'int'; break }
        case 'string' : { type = 'string'; break }
        case 'boolean': { type = 'boolean'; break }
        case 'smallint': { type = 'smallint'; break }
        case 'datetime': { type = 'datetime'; break }
        case 'array': { type = 'string'; break }
      }
      
      if (!type) { continue }
      
      let params = { type };
      
      params.notNull = !(options.null === true);
      
      if ('unique' in options) {
        params.unique = options.unique === true;
      }
      
      result[ options.dbName ] = params;
    }
    
    return result;
  };
  
  assignLinksToOne = assignLinksToOne(this);
  
  assignLinksToMany = assignLinksToMany(this);
}

function nameToDbName(name) {
  if (!~name.indexOf('.')) {
    return name;
  }
  
  return name.replace(/\.\w{1}/gi, match => match.slice(1).toUpperCase());
}

function getFieldsMask(names, properties, fieldsMask) {
  return names.reduce((result, propertyName) => {
    const property = properties[ propertyName ];
    
    let propertyMasks = property.fieldsMask;
    
    if (propertyMasks === undefined) {
      propertyMasks = true;
    }
    
    if (isBoolean(propertyMasks)) {
      propertyMasks = fieldsMask.reduce((result, fieldMask) => {
        result[ fieldMask ] = propertyMasks;
        return result;
      }, {});
    }
    
    // Если указали в формате строки - разобьем ее по сепаратору и преобразуем к объекту
    // Если указали в формате массива - преобразуем к объекту
    if (isString(propertyMasks) || Array.isArray(propertyMasks)) {
      let list = isString(propertyMasks) ? propertyMasks.split(':') : propertyMasks;
      propertyMasks = list.reduce((result, name) => {
        let hasNot = !!~name.indexOf('!');
        
        if (!~name.indexOf('!')) {
          result[ name ] = true;
        }
        
        return result;
      }, {});
    }
    
    if (!isPlainObject(propertyMasks)) {
      throw PropertyMustBeType({
        propertyName: `${ propertyName }.fieldsMask`,
        propertyType: 'string | array<string> | object'
      });
    }
    
    return fieldsMask.reduce((result, fieldMask) => {
      result[ fieldMask ] = result[ fieldMask ] || [];
      
      // Если в описании свойства указали fieldsMask
      // И указанное значение равно true - добавим его во все маски
      if (
        fieldMask === 'full' && (!(fieldMask in propertyMasks) || propertyMasks[ fieldMask ] !== false)
        || fieldMask in propertyMasks && propertyMasks[ fieldMask ] === true
      ) {
        result[ fieldMask ].push(property.dbName);
      }
      
      return result;
    }, result);
  }, { full: [] });
}

/**
 * @param {string} name
 * @returns {string}
 */
function getTableName(name) {
  return name.toLocaleLowerCase();
}