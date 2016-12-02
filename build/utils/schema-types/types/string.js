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

var _setMinMax = require('../utils/validators/set-min-max');

var _setMinMax2 = _interopRequireDefault(_setMinMax);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

var _lodash3 = require('lodash.isnumber');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  value: 'string',
  schema: (0, _lodash2.default)(schemaValidate)
};


function schemaValidate() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

  let schema = _joi2.default.string();

  const truncate = options.truncate,
        length = options.length,
        max = options.max;


  if ('length' in options && (0, _lodash4.default)(length) && length >= 0) {
    schema = schema.length(+length, 'utf8');
  } else {
    schema = (0, _setMinMax2.default)()(options, schema);

    if ('max' in options && (0, _lodash4.default)(max)) {
      if ('truncate' in options && truncate === true) {
        schema = schema.truncate();
      }
    }
  }

  if ('enum' in options && Array.isArray(options.enum)) {
    schema = schema.valid(options.enum).insensitive();
  }

  schema = ['trim', 'lowercase', 'uppercase'].reduce((schema, name) => {
    if (name in options && options[name] === true) {
      schema = schema[name]();
    }
    return schema;
  }, schema);

  return (0, _applyValidators2.default)(options, schema, [_setDefault2.default, _setRequired2.default]);
}
//# sourceMappingURL=string.js.map