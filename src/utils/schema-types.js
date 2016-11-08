import Joi from 'joi';
import memoize from 'lodash.memoize';
import isFunction from 'lodash.isfunction';
import isNumber from './is-number';

const MIN_SMALLINT = -32768;
const MIN_INTEGER = -2147483648;
const MIN_BIGINT = -9223372036854775808;
const MIN_MONEY = -92233720368547758.08;

const MAX_SMALLINT = 32767;
const MAX_INTEGER = 2147483647;
const MAX_BIGINT = 9223372036854775807;
const MAX_MONEY = 92233720368547758.07;

function setDefault(options, schema) {

  if ('default' in options) {
    if (isFunction(options.default) || !Joi.validate(options.default, schema).error) {
      schema = schema.default(options.default);
    }
  }

  return schema;
}

function setRequired(options, schema) {
  let { required } = options;

  if ('required' in options && options.required === true) {
    schema = schema.required();
  }

  return schema;
}

function setMinMax(defaults = {}) {
  return (options, schema) => {
    const { min:defaultMin, max:defaultMax } = defaults;
    let { min = defaultMin, max = defaultMax } = options;
    const hasMin = isNumber(min);
    const hasMax = isNumber(max);

    if (hasMin) {
      if (min < defaultMin) { min = defaultMin }
      if (hasMax && min > max) { min = max }
      schema = schema.min(+min);
    }

    if (hasMax) {
      if (max > defaultMax) { max = defaultMax }
      if (hasMin && max < min) { max = min }
      schema = schema.max(+max);
    }

    return schema;
  };
}

function applyValidators(options, schema, validators) {
  return validators.reduce((schema, validator) => validator(options, schema), schema);
}

export default {
  get boolean() {
    return {
      value : 'boolean',
      schema: memoize((options = Object.create(null)) => {
        return applyValidators(options, Joi.boolean(), [
          setDefault,
          setRequired
        ]);
      })
    };
  },
  get number() {
    return {
      value : 'number',
      schema: memoize((options = Object.create(null)) => {
        const schema = Joi.number().integer().positive();
        return applyValidators(options, schema, [
          setDefault,
          setRequired,
          setMinMax({ min: 0, max: MAX_INTEGER })
        ]);
      })
    };
  },
  get smallint() {
    return {
      value : 'smallint',
      schema: memoize((options = Object.create(null)) => {
        const schema = Joi.number().integer();
        return applyValidators(options, schema, [
          setDefault,
          setRequired,
          setMinMax({ min: MIN_SMALLINT, max: MAX_SMALLINT })
        ]);
      })
    };
  },
  get integer() {
    return {
      value : 'integer',
      schema: memoize((options = Object.create(null)) => {
        const schema = Joi.number().integer();
        return applyValidators(options, schema, [
          setDefault,
          setRequired,
          setMinMax({ min: MIN_INTEGER, max: MAX_INTEGER })
        ]);
      })
    };
  },
  get float() {
    return {
      value : 'float',
      schema: memoize((options = Object.create(null)) => {
        const defaultLimitMin = 0;
        const defaultLimitMax = 15;
        const defaultLimit = 6;
        let { limit = defaultLimit } = options;
  
        if (!isNumber(limit)) {
          limit = defaultLimit;
        } else {
          if (limit < defaultLimitMin) { limit = defaultLimitMin }
          if (limit > defaultLimitMax) { limit = defaultLimitMax }
        }
  
        const schema = Joi.number().precision(limit);
  
        return applyValidators(options, schema, [
          setDefault,
          setRequired,
          setMinMax({ min: MIN_INTEGER, max: MAX_INTEGER })
        ]);
      })
    };
  },
  get money() {
    return {
      value : 'money',
      schema: memoize((options = Object.create(null)) => {
        const schema = Joi.number().precision(2).min(MIN_MONEY).max(MAX_MONEY);
        return applyValidators(options, schema, [
          setDefault,
          setRequired
        ]);
      })
    };
  },
  get string() {
    return {
      value : 'string',
      schema: memoize((options = Object.create(null)) => {
        let schema = Joi.string();
        
        const { truncate, length, max } = options;
  
        if ('length' in options && isNumber(length) && length >= 0) {
          schema = schema.length(+length, 'utf8');
        } else {
          schema = setMinMax()(options, schema);
    
          if ('max' in options && isNumber(max)) {
            if ('truncate' in options && truncate === true) {
              schema = schema.truncate();
            }
          }
        }
  
        if ('enum' in options && Array.isArray(options.enum)) {
          schema = schema.valid(options.enum).insensitive();
        }
  
        schema = [ 'trim', 'lowercase', 'uppercase' ].reduce((schema, name) => {
          if (name in options && options[ name ] === true) {
            schema = schema[ name ]();
          }
          return schema;
        }, schema);
  
        return applyValidators(options, schema, [
          setDefault,
          setRequired
        ]);
      })
    };
  },
  get text() {
    return {
      value : 'text',
      schema: memoize((options = Object.create(null)) => {
        let schema = Joi.string();

        return applyValidators(options, schema, [
          setMinMax(),
          setDefault,
          setRequired
        ]);
      })
    };
  },
  get datetime() {
    return {
      value : 'datetime',
      schema: memoize((options = Object.create(null)) => {
        let schema = Joi.date().iso();
        
        return applyValidators(options, schema, [
          setDefault,
          setRequired
        ]);
      })
    };
  },
  get array() {
    return {
      value : 'array',
      schema: memoize((options = Object.create(null)) => {
        let schema = Joi.string();

        return applyValidators(options, schema, [
          setDefault,
          setRequired
        ]);
      })
    };
  }
};