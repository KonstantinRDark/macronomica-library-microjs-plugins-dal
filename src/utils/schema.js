import Joi from 'joi';
import TypedError from 'error/typed';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import isBoolean from 'lodash.isboolean';
import uniq from 'lodash.uniq';
import SchemaTypes from './schema-types';

const PropertyMustBeType = TypedError({
  message     : '{name} - свойство "{propertyName}" должно быть "{propertyType}"',
  type        : 'micro.plugins.dal.property.must.be.type',
  code        : 400,
  propertyName: null,
  propertyType: null
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

    this.fieldsMask = uniq([ ...FIELDS_MASK, ...(fieldsMask || []) ]);
    this.tableName = (tableName || getTableName(modelName)).replace('-', '_');

    this.properties = {
      id: {
        type         : SchemaTypes.number,
        autoincrement: true
      },
      ...properties
    };

    this.__propertiyNames = Object.keys(this.properties);
    this.__masks = getFieldsMask(this.__propertiyNames, this.properties, this.fieldsMask);
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

  getMyParams = (params = {}) => Object.keys(params).reduce((result, name) => {
    if (this.has(name)) {
      result[ name ] = params[ name ];
    }
    return params;
  }, {});

  has = (property) => {
    return isString(property) && !!this.properties[ property ];
  };

  validate = (property, value) => {
    const props = this.properties[ property ];
    if (!props) { return false }

    if ('convertIn' in props.type) {
      value = props.type.convertIn(value, props);
    }

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

      result[ name ] = params;
    }

    return result;
  }
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
        result[ hasNot ? name.replace('!', '') : name ] = !hasNot;
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

      // Если в описании свойства не указали fieldsMask
      // Или если указанное значение не равно false - добавим его во все маски
      if (!(fieldMask in propertyMasks) || propertyMasks[ fieldMask ] !== false) {
        result[ fieldMask ].push(propertyName);
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