'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _isNumber = require('./is-number');

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_SMALLINT = -32768;
var MIN_INTEGER = -2147483648;
var MIN_BIGINT = -9223372036854775808;
var MIN_MONEY = -92233720368547758.08;

var MAX_SMALLINT = 32767;
var MAX_INTEGER = 2147483647;
var MAX_BIGINT = 9223372036854775807;
var MAX_MONEY = 92233720368547758.07;

function setDefault(options, schema) {

  if ('default' in options) {
    if ((0, _lodash4.default)(options.default) || !_joi2.default.validate(options.default, schema).error) {
      schema = schema.default(options.default);
    }
  }

  return schema;
}

function setRequired(options, schema) {
  var required = options.required;


  if ('required' in options && options.required === true) {
    schema = schema.required();
  }

  return schema;
}

function setMinMax() {
  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (options, schema) {
    var defaultMin = defaults.min,
        defaultMax = defaults.max;
    var _options$min = options.min,
        min = _options$min === undefined ? defaultMin : _options$min,
        _options$max = options.max,
        max = _options$max === undefined ? defaultMax : _options$max;

    var hasMin = (0, _isNumber2.default)(min);
    var hasMax = (0, _isNumber2.default)(max);

    if (hasMin) {
      if (min < defaultMin) {
        min = defaultMin;
      }
      if (hasMax && min > max) {
        min = max;
      }
      schema = schema.min(+min);
    }

    if (hasMax) {
      if (max > defaultMax) {
        max = defaultMax;
      }
      if (hasMin && max < min) {
        max = min;
      }
      schema = schema.max(+max);
    }

    return schema;
  };
}

function applyValidators(options, schema, validators) {
  return validators.reduce(function (schema, validator) {
    return validator(options, schema);
  }, schema);
}

exports.default = {
  get boolean() {
    return {
      value: 'boolean',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        return applyValidators(options, _joi2.default.boolean(), [setDefault, setRequired]);
      })
    };
  },
  get number() {
    return {
      value: 'number',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.number().integer().positive();
        return applyValidators(options, schema, [setDefault, setRequired, setMinMax({ min: 0, max: MAX_INTEGER })]);
      })
    };
  },
  get smallint() {
    return {
      value: 'smallint',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.number().integer();
        return applyValidators(options, schema, [setDefault, setRequired, setMinMax({ min: MIN_SMALLINT, max: MAX_SMALLINT })]);
      })
    };
  },
  get integer() {
    return {
      value: 'integer',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.number().integer();
        return applyValidators(options, schema, [setDefault, setRequired, setMinMax({ min: MIN_INTEGER, max: MAX_INTEGER })]);
      })
    };
  },
  get float() {
    return {
      value: 'float',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var defaultLimitMin = 0;
        var defaultLimitMax = 15;
        var defaultLimit = 6;
        var _options$limit = options.limit,
            limit = _options$limit === undefined ? defaultLimit : _options$limit;


        if (!(0, _isNumber2.default)(limit)) {
          limit = defaultLimit;
        } else {
          if (limit < defaultLimitMin) {
            limit = defaultLimitMin;
          }
          if (limit > defaultLimitMax) {
            limit = defaultLimitMax;
          }
        }

        var schema = _joi2.default.number().precision(limit);

        return applyValidators(options, schema, [setDefault, setRequired, setMinMax({ min: MIN_INTEGER, max: MAX_INTEGER })]);
      })
    };
  },
  get money() {
    return {
      value: 'money',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.number().precision(2).min(MIN_MONEY).max(MAX_MONEY);
        return applyValidators(options, schema, [setDefault, setRequired]);
      })
    };
  },
  get string() {
    return {
      value: 'string',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.string();

        var truncate = options.truncate,
            length = options.length,
            max = options.max;


        if ('length' in options && (0, _isNumber2.default)(length) && length >= 0) {
          schema = schema.length(+length, 'utf8');
        } else {
          schema = setMinMax()(options, schema);

          if ('max' in options && (0, _isNumber2.default)(max)) {
            if ('truncate' in options && truncate === true) {
              schema = schema.truncate();
            }
          }
        }

        if ('enum' in options && Array.isArray(options.enum)) {
          schema = schema.valid(options.enum).insensitive();
        }

        schema = ['trim', 'lowercase', 'uppercase'].reduce(function (schema, name) {
          if (name in options && options[name] === true) {
            schema = schema[name]();
          }
          return schema;
        }, schema);

        return applyValidators(options, schema, [setDefault, setRequired]);
      })
    };
  },
  get text() {
    return {
      value: 'text',
      schema: (0, _lodash2.default)(function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

        var schema = _joi2.default.string();

        return applyValidators(options, schema, [setMinMax(), setDefault, setRequired]);
      })
    };
  }
};
//# sourceMappingURL=schema-types.js.map
