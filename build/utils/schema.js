'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Types = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _schemaTypes = require('./schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Types = exports.Types = _schemaTypes2.default;

class Schema {

  constructor(modelName) {
    var _this = this;

    let properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    let tableName = _ref.tableName;
    this.tableName = undefined;

    this.getMyFields = function () {
      let fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['id'];
      return fields.reduce((fields, name) => {
        if (_this.has(name)) {
          fields.push(name);
        }
        return fields;
      }, []);
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
      return !!this.properties[property];
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

    this.tableName = tableName || getTableName(modelName);
    this.properties = _extends({
      id: {
        type: _schemaTypes2.default.number,
        autoincrement: true
      }
    }, properties);
  }

}

exports.default = Schema; /**
                           * @param {string} name
                           * @returns {string}
                           */

function getTableName(name) {
  return name.toLocaleLowerCase();
}
//# sourceMappingURL=schema.js.map