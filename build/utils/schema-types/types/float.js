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

var _constants = require('../utils/constants');

var _applyValidators = require('../utils/apply-validators');

var _applyValidators2 = _interopRequireDefault(_applyValidators);

var _setDefault = require('../utils/validators/set-default');

var _setDefault2 = _interopRequireDefault(_setDefault);

var _setMinMax = require('../utils/validators/set-min-max');

var _setMinMax2 = _interopRequireDefault(_setMinMax);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

var _lodash3 = require('lodash.isnumber');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  value: 'float',
  schema: (0, _lodash2.default)(schemaValidate)
};


function schemaValidate() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _create2.default)(null);

  const defaultLimitMin = 0;
  const defaultLimitMax = 15;
  const defaultLimit = 6;
  var _options$limit = options.limit;
  let limit = _options$limit === undefined ? defaultLimit : _options$limit;


  if (!(0, _lodash4.default)(limit)) {
    limit = defaultLimit;
  } else {
    if (limit < defaultLimitMin) {
      limit = defaultLimitMin;
    }
    if (limit > defaultLimitMax) {
      limit = defaultLimitMax;
    }
  }

  const schema = _joi2.default.number().precision(limit);

  return (0, _applyValidators2.default)(options, schema, [_setDefault2.default, _setRequired2.default, (0, _setMinMax2.default)({ min: _constants.MIN_INTEGER, max: _constants.MAX_INTEGER })]);
}
//# sourceMappingURL=float.js.map