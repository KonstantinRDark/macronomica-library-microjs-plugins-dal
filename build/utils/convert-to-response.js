'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertToResponse;

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _checkConvertOut = require('./check-convert-out');

var _checkConvertOut2 = _interopRequireDefault(_checkConvertOut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToResponse(schema, fields) {
  const convertOuts = (0, _checkConvertOut2.default)(schema.properties);

  return resultData => {
    if ((0, _lodash2.default)(resultData) || resultData.constructor.name === 'anonymous') {
      let result = {};
      let names = Object.keys(resultData);

      for (let dbName of names) {
        let name = schema.dbProperties[dbName].name;
        let value = resultData[dbName];

        if (dbName in convertOuts) {
          value = callback(value, schema.properties[name]);
        }

        result = _dotObject2.default.str(name, value, result);
      }

      return result;
    } else {
      let result = {};
      // Берем первое указанное имя в fields, по идее оно там одно
      let key = fields[0];
      let value = resultData[0] || resultData;

      if (key in convertOuts) {
        value = callback(value, schema.dbProperties[key].name);
      }

      result = _dotObject2.default.str(key, value, result);
      return result;
    }
  };
}
//# sourceMappingURL=convert-to-response.js.map