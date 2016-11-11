'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setDefault;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setDefault(options, schema) {

  if ('default' in options) {
    if ((0, _lodash2.default)(options.default) || !_joi2.default.validate(options.default, schema).error) {
      schema = schema.default(options.default);
    }
  }

  return schema;
}
//# sourceMappingURL=set-default.js.map