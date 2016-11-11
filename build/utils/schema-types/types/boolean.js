'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _applyValidators = require('../utils/apply-validators');

var _applyValidators2 = _interopRequireDefault(_applyValidators);

var _setDefault = require('../utils/validators/set-default');

var _setDefault2 = _interopRequireDefault(_setDefault);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  value: 'boolean',
  schema: (0, _lodash2.default)(schemaValidate)
};


function schemaValidate() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

  return (0, _applyValidators2.default)(options, _joi2.default.boolean(), [_setDefault2.default, _setRequired2.default]);
}
//# sourceMappingURL=boolean.js.map