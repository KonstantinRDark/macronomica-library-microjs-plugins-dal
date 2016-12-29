'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELDS_MASK = exports.Types = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isboolean');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.uniq');

var _lodash8 = _interopRequireDefault(_lodash7);

var _schemaTypes = require('./schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PropertyMustBeType = (0, _typed2.default)({
  message: '{name} - свойство "{propertyName}" должно быть "{propertyType}"',
  type: 'micro.plugins.dal.property.must.be.type',
  code: 400,
  propertyName: null,
  propertyType: null
});

const Types = exports.Types = _schemaTypes2.default;
const FIELDS_MASK = exports.FIELDS_MASK = ['full'];

class Schema {

  constructor(modelName) {
    var _this = this;

    let properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    let tableName = _ref.tableName,
        fieldsMask = _ref.fieldsMask;
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
            fields.push(name);
          }
          return fields;
        }, []);
      }
    };

    this.getMyParams = function () {
      let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.keys(params).reduce((result, name) => {
        if (_this.has(name)) {
          result[name] = params[name];
        }
        return params;
      }, {});
    };

    this.has = property => {
      return (0, _lodash2.default)(property) && !!this.properties[property];
    };

    this.validate = (property, value) => {
      const props = this.properties[property];
      if (!props) {
        return false;
      }

      if ('convertIn' in props.type) {
        value = props.type.convertIn(value, props);
      }

      if ('null' in props && Boolean(props.null) === true && value === null) {
        return {
          value,
          error: undefined
        };
      }

      const valid = _joi2.default.validate(value, props.type.schema(props));

      if (valid.error) {
        return {
          value: valid.value,
          error: {
            code: 'error.dal.params',
            message: `${ property }: ${ valid.error.message }`
          }
        };
      }

      return valid;
    };

    this.migrateCreateTableSchema = () => {
      const fields = Object.keys(this.properties);
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

        result[name] = params;
      }

      return result;
    };

    if (!(0, _lodash2.default)(modelName)) {
      throw PropertyMustBeType({ propertyName: 'modelName', propertyType: 'string' });
    }

    if (fieldsMask !== undefined && (!Array.isArray(fieldsMask) || fieldsMask.some(name => !(0, _lodash2.default)(name)))) {
      throw PropertyMustBeType({ propertyName: 'fieldsMask', propertyType: 'array<string>' });
    }

    if (!(0, _lodash2.default)(tableName)) {
      throw PropertyMustBeType({ propertyName: 'tableName', propertyType: 'string' });
    }

    this.fieldsMask = (0, _lodash8.default)([...FIELDS_MASK, ...(fieldsMask || [])]);
    this.tableName = (tableName || getTableName(modelName)).replace('-', '_');

    this.properties = _extends({
      id: {
        type: _schemaTypes2.default.number,
        autoincrement: true
      }
    }, properties);

    this.__propertiyNames = Object.keys(this.properties);
    this.__masks = getFieldsMask(this.__propertiyNames, this.properties, this.fieldsMask);
  }

}

exports.default = Schema;
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
        result[hasNot ? name.replace('!', '') : name] = !hasNot;
        return result;
      }, {});
    }

    if (!(0, _lodash4.default)(propertyMasks)) {
      throw PropertyMustBeType({
        propertyName: `${ propertyName }.fieldsMask`,
        propertyType: 'string | array<string> | object'
      });
    }

    return fieldsMask.reduce((result, fieldMask) => {
      result[fieldMask] = result[fieldMask] || [];

      // Если в описании свойства не указали fieldsMask
      // Или если указанное значение не равно false - добавим его во все маски
      if (!(fieldMask in propertyMasks) || propertyMasks[fieldMask] !== false) {
        result[fieldMask].push(propertyName);
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
//# sourceMappingURL=schema.js.map