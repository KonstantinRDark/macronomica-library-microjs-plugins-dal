'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isstring');

var _lodash4 = _interopRequireDefault(_lodash3);

var _applyValidators = require('../utils/apply-validators');

var _applyValidators2 = _interopRequireDefault(_applyValidators);

var _setDefault = require('../utils/validators/set-default');

var _setDefault2 = _interopRequireDefault(_setDefault);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

var _lodash5 = require('lodash.isnumber');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  value: 'array',
  convertIn,
  convertOut,
  schema: (0, _lodash2.default)(schemaValidate)
};


function schemaValidate() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

  let schema = _joi2.default.string();

  return (0, _applyValidators2.default)(options, schema, [_setDefault2.default, _setRequired2.default]);
}

function convertIn(value) {
  if (Array.isArray(value)) {
    let result = value.reduce(filterIterator, []).join(',');

    if ((0, _lodash4.default)(result) && result === '') {
      result = null;
    }

    return result;
  }

  return value;
}

function convertOut(value) {
  if ((0, _lodash4.default)(value)) {
    return value === '' ? undefined : value.split(',').map(id => +id);
  }

  return value;
}

function filterIterator() {
  let result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let raw = arguments[1];

  if (!!raw && typeof raw == 'object') {
    raw = raw.id;
  }

  if ((0, _lodash6.default)(raw)) {
    result.push(raw);
  }

  return result;
}
//# sourceMappingURL=array.js.map