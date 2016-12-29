'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _lodash2.default)(properties => {
  const keys = Object.keys(properties);
  const result = {};

  for (let key of keys) {
    let convertOut = properties[key].type.convertOut;

    if ((0, _lodash4.default)(convertOut)) {
      result[properties[key].dbName] = convertOut;
    }
  }

  return result;
});
//# sourceMappingURL=check-convert-out.js.map