'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = convertToResponse;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _checkConvertOut = require('./check-convert-out');

var _checkConvertOut2 = _interopRequireDefault(_checkConvertOut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToResponse(schema, fields) {
  const convertOuts = (0, _checkConvertOut2.default)(schema.properties);

  return result => {
    if ((0, _lodash2.default)(result) || result.constructor.name === 'anonymous') {
      for (let _ref of convertOuts) {
        let name = _ref.name;
        let callback = _ref.callback;

        result[name] = callback(result[name], schema.properties[name]);
      }

      return _extends({}, result);
    } else {
      let key = fields[0];
      let value = result[0] || result;

      for (let _ref2 of convertOuts) {
        let name = _ref2.name;
        let callback = _ref2.callback;

        if (key === name) {
          value = callback(value, schema.properties[name]);
          break;
        }
      }

      return { [key]: value };
    }
  };
}
//# sourceMappingURL=convert-to-response.js.map