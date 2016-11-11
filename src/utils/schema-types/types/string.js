import Joi from 'joi';
import memoize from 'lodash.memoize';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setMinMax from '../utils/validators/set-min-max';
import setRequired from '../utils/validators/set-required';
import isNumber from '../../../utils/is-number';

export default {
  value : 'string',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
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
}