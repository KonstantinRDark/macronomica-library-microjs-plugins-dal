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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Types = exports.Types = _schemaTypes2.default;

var Schema = function Schema(modelName) {
  var _this = this;

  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      tableName = _ref.tableName;

  _classCallCheck(this, Schema);

  this.tableName = undefined;

  this.getMyFields = function () {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['id'];
    return fields.reduce(function (fields, name) {
      if (_this.has(name)) {
        fields.push(name);
      }
      return fields;
    }, []);
  };

  this.getMyParams = function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(params).reduce(function (result, name) {
      if (_this.has(name)) {
        result[name] = params[name];
      }
      return params;
    }, {});
  };

  this.has = function (property) {
    return !!_this.properties[property];
  };

  this.validate = function (property, value) {
    var props = _this.properties[property];
    if (!props) {
      return false;
    }

    if ('null' in props && Boolean(props.null) === true && value === null) {
      return {
        value: value,
        error: undefined
      };
    }

    var valid = _joi2.default.validate(value, props.type.schema(props));

    if (valid.error) {
      return {
        value: valid.value,
        error: {
          code: 'error.dal.params',
          message: property + ': ' + valid.error.message
        }
      };
    }

    return valid;
  };

  this.migrateCreateTableSchema = function () {
    var fields = Object.keys(_this.properties);
    var result = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var name = _step.value;

        var options = _this.properties[name];

        if (name === 'id') {
          result[name] = { type: 'int', primaryKey: true, autoIncrement: true, notNull: true };
          continue;
        }

        var type = void 0;

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
              type = 'float';break;
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
        }

        if (!type) {
          continue;
        }

        var params = { type: type };

        params.notNull = !(options.null === true);

        if ('unique' in options) {
          params.unique = options.unique === true;
        }

        result[name] = params;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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
};

/**
 * @param {string} name
 * @returns {string}
 */


exports.default = Schema;
function getTableName(name) {
  return name.toLocaleLowerCase();
}
//# sourceMappingURL=schema.js.map
