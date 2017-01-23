'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELDS_MASK = exports.Types = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isboolean');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.uniq');

var _lodash8 = _interopRequireDefault(_lodash7);

var _schemaTypes = require('./../schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

var _assignLinksToOne = require('./assign-links-to-one');

var _assignLinksToOne2 = _interopRequireDefault(_assignLinksToOne);

var _assignLinksToMany = require('./assign-links-to-many');

var _assignLinksToMany2 = _interopRequireDefault(_assignLinksToMany);

var _sqlStringProtector = require('./../sql-string-protector');

var _sqlStringProtector2 = _interopRequireDefault(_sqlStringProtector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PropertyMustBeType = (0, _typed2.default)({
  message: '{name} - свойство "{propertyName}" должно быть "{propertyType}"',
  type: 'micro.plugins.dal.schema.property.must.be.type',
  code: 400,
  propertyName: null,
  propertyType: null
});

const DetectedSqlInjectionError = (0, _typed2.default)({
  message: '{name} - обнаружена потенциальная SQL инъекция в свойстве "{propertyName}"',
  type: 'micro.plugins.dal.schema.detected.sql.injection',
  code: 500,
  propertyName: null,
  propertyValue: null
});

const ValidateError = (0, _wrapped2.default)({
  message: '{name} - ошибка валидации свойства {propertyName} - {origMessage}',
  type: 'micro.plugins.dal.schema.validate.error',
  code: 400,
  propertyName: null,
  propertyValue: null
});

const Types = exports.Types = _schemaTypes2.default;
const FIELDS_MASK = exports.FIELDS_MASK = ['full'];

class Schema {

  constructor(modelName) {
    let properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    let tableName = _ref.tableName,
        fieldsMask = _ref.fieldsMask;

    _initialiseProps.call(this);

    if (!(0, _lodash2.default)(modelName)) {
      throw PropertyMustBeType({ propertyName: 'modelName', propertyType: 'string' });
    }

    if (fieldsMask !== undefined && (!Array.isArray(fieldsMask) || fieldsMask.some(name => !(0, _lodash2.default)(name)))) {
      throw PropertyMustBeType({ propertyName: 'fieldsMask', propertyType: 'array<string>' });
    }

    if (!(0, _lodash2.default)(tableName)) {
      throw PropertyMustBeType({ propertyName: 'tableName', propertyType: 'string' });
    }

    let schema = this;
    schema.fieldsMask = (0, _lodash8.default)([...FIELDS_MASK, ...(fieldsMask || [])]);
    schema.tableName = (tableName || getTableName(modelName)).replace(/-/g, '_');
    schema.dbProperties = {};

    schema.properties = (0, _extends3.default)({
      id: {
        type: _schemaTypes2.default.number,
        name: 'id',
        dbName: 'id',
        autoincrement: true
      }
    }, (0, _keys2.default)(properties).reduce((properties, name) => {
      let dbName = nameToDbName(name);
      this.dbProperties[dbName] = (0, _assign2.default)(properties[name], { name, dbName });
      return properties;
    }, properties));
    schema.dbProperties.id = schema.properties.id;
    schema.__propertiesNames = (0, _keys2.default)(schema.properties);
    schema.__masks = getFieldsMask(schema.__propertiesNames, schema.properties, schema.fieldsMask);

    schema.__assignLinksMany = schema.__propertiesNames.reduce((result, propertyName) => {
      let property = schema.properties[propertyName];
      let name = 'list';

      if ('link' in property && name in property.link) {
        result.keys.push(propertyName);
        result[propertyName] = property.link[name];
      }

      return result;
    }, { keys: [] });
  }

}

exports.default = Schema;

var _initialiseProps = function () {
  var _this = this;

  this.tableName = undefined;

  this.getMyFields = fields => {
    // Если в свойстве fields строка - берем заранее заготовленный список пло маске
    if ((0, _lodash2.default)(fields)) {
      if (!!this.__masks[fields]) {
        return this.__masks[fields];
      }

      fields = undefined;
    }

    if (fields === undefined) {
      fields = ['id'];
    }

    if (Array.isArray(fields)) {
      return fields.reduce((fields, name) => {
        if (this.has(name)) {
          fields.push(this.properties[name].dbName);
        }
        return fields;
      }, []);
    }
  };

  this.setParams = params => {
    let schema = this;
    let names = (0, _keys2.default)(schema.properties);
    let result = {};

    for (let propertyName of names) {
      let property = schema.properties[propertyName];
      let value = _dotObject2.default.pick(propertyName, params) || _dotObject2.default.pick(property.dbName, params);

      if (value === undefined) {
        continue;
      }

      if (!(0, _sqlStringProtector2.default)(value)) {
        throw DetectedSqlInjectionError({ propertyName, propertyValue: value });
      }

      if ('convertIn' in property.type) {
        value = property.type.convertIn(value, property);
      }

      let valid = schema.validate(propertyName, value);

      if (valid.error) {
        throw valid.error;
      }

      result[property.dbName] = valid.value;
    }

    return result;
  };

  this.getMyCriteriaParams = function () {
    let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    let schema = _this;
    let result = (0, _keys2.default)(schema.properties).reduce(reduce, {});
    return result;

    function reduce(result, propertyName) {
      let property = schema.properties[propertyName];
      let value = _dotObject2.default.pick(propertyName, params) || _dotObject2.default.pick(property.dbName, params);

      if (value !== undefined) {
        result[property.dbName] = value;
      }

      return result;
    }
  };

  this.has = property => {
    return (0, _lodash2.default)(property) && !!this.properties[property];
  };

  this.validate = (propertyName, value) => {
    const props = this.properties[propertyName];
    if (!props) {
      return false;
    }

    if ('null' in props && props.null === true && (value === null || value === '')) {
      return {
        value,
        error: undefined
      };
    }

    const valid = _joi2.default.validate(value, props.type.schema(props));

    if (valid.error) {
      valid.error = ValidateError(valid.error, { propertyName, propertyValue: value });
    }

    return valid;
  };

  this.migrateCreateTableSchema = () => {
    const fields = (0, _keys2.default)(this.properties);
    const result = {};

    for (let name of fields) {
      let options = this.properties[name];

      if (name === 'id') {
        result[name] = { type: 'int', primaryKey: true, autoIncrement: true, notNull: true };
        continue;
      }

      let type;

      switch (options.type.value) {
        case 'date':
          {
            type = 'date';break;
          }
        case 'text':
          {
            type = 'text';break;
          }
        case 'float':
          {
            type = 'decimal';break;
          }
        case 'money':
          {
            type = 'decimal';break;
          }
        case 'number':
        case 'integer':
          {
            type = 'int';break;
          }
        case 'string':
          {
            type = 'string';break;
          }
        case 'boolean':
          {
            type = 'boolean';break;
          }
        case 'smallint':
          {
            type = 'smallint';break;
          }
        case 'datetime':
          {
            type = 'datetime';break;
          }
        case 'array':
          {
            type = 'string';break;
          }
      }

      if (!type) {
        continue;
      }

      let params = { type };

      params.notNull = !(options.null === true);

      if ('unique' in options) {
        params.unique = options.unique === true;
      }

      result[options.dbName] = params;
    }

    return result;
  };

  this.assignLinksToOne = (0, _assignLinksToOne2.default)(this);
  this.assignLinksToMany = (0, _assignLinksToMany2.default)(this);
};

function nameToDbName(name) {
  if (!~name.indexOf('.')) {
    return name;
  }

  return name.replace(/\.\w{1}/gi, match => match.slice(1).toUpperCase());
}

function getFieldsMask(names, properties, fieldsMask) {
  return names.reduce((result, propertyName) => {
    const property = properties[propertyName];

    let propertyMasks = property.fieldsMask;

    if (propertyMasks === undefined) {
      propertyMasks = true;
    }

    if ((0, _lodash6.default)(propertyMasks)) {
      propertyMasks = fieldsMask.reduce((result, fieldMask) => {
        result[fieldMask] = propertyMasks;
        return result;
      }, {});
    }

    // Если указали в формате строки - разобьем ее по сепаратору и преобразуем к объекту
    // Если указали в формате массива - преобразуем к объекту
    if ((0, _lodash2.default)(propertyMasks) || Array.isArray(propertyMasks)) {
      let list = (0, _lodash2.default)(propertyMasks) ? propertyMasks.split(':') : propertyMasks;
      propertyMasks = list.reduce((result, name) => {
        let hasNot = !!~name.indexOf('!');

        if (!~name.indexOf('!')) {
          result[name] = true;
        }

        return result;
      }, {});
    }

    if (!(0, _lodash4.default)(propertyMasks)) {
      throw PropertyMustBeType({
        propertyName: `${propertyName}.fieldsMask`,
        propertyType: 'string | array<string> | object'
      });
    }

    return fieldsMask.reduce((result, fieldMask) => {
      result[fieldMask] = result[fieldMask] || [];

      // Если в описании свойства указали fieldsMask
      // И указанное значение равно true - добавим его во все маски
      if (fieldMask === 'full' && (!(fieldMask in propertyMasks) || propertyMasks[fieldMask] !== false) || fieldMask in propertyMasks && propertyMasks[fieldMask] === true) {
        result[fieldMask].push(property.dbName);
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
//# sourceMappingURL=index.js.map