'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = convertToResponse;

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _checkConvertOut = require('./check-convert-out');

var _checkConvertOut2 = _interopRequireDefault(_checkConvertOut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToResponse(schema, fields) {
  return resultData => {
    if ((0, _lodash2.default)(resultData) || resultData.constructor.name === 'anonymous') {
      let result = {};
      let names = (0, _keys2.default)(resultData);

      for (let dbName of names) {
        let name = schema.dbProperties[dbName].name;
        let property = schema.properties[name];
        let value = resultData[dbName];

        if ('convertOut' in property.type) {
          value = property.type.convertOut(value, property);
        }

        if (value === undefined || value === null || value === '') {
          continue;
        }

        result = _dotObject2.default.str(name, value, result);
      }

      return result;
    } else {
      let result = {};
      // Берем первое указанное имя в fields, по идее оно там одно
      let dbName = fields[0];
      let value = resultData[0] || resultData;
      let name = schema.dbProperties[dbName].name;
      let property = schema.properties[name];

      if ('convertOut' in property.type) {
        value = property.type.convertOut(value, property);
      }

      if (value === undefined || value === null || value === '') {
        return result;
      }

      result = _dotObject2.default.str(name, value, result);
      return result;
    }
  };
}
//# sourceMappingURL=convert-to-response.js.map