'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isstring');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isboolean');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.isnumber');

var _lodash8 = _interopRequireDefault(_lodash7);

var _applyValidators = require('../utils/apply-validators');

var _applyValidators2 = _interopRequireDefault(_applyValidators);

var _setDefault = require('../utils/validators/set-default');

var _setDefault2 = _interopRequireDefault(_setDefault);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  value: 'boolean',
  schema: (0, _lodash2.default)(schemaValidate),
  convertIn,
  convertOut
};


function schemaValidate() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _create2.default)(null);

  return (0, _applyValidators2.default)(options, _joi2.default.boolean(), [_setDefault2.default, _setRequired2.default]);
}

function convertIn(value, options) {
  if ((0, _lodash4.default)(value)) {
    value = value.toLowerCase() === 'true' ? true : options.default;
  }

  if ((0, _lodash6.default)(value)) {
    value = !!value ? 1 : 0;
  }

  return value;
}

function convertOut(value) {
  if ((0, _lodash8.default)(value)) {
    value = value === 1;
  }

  return value;
}
//# sourceMappingURL=boolean.js.map