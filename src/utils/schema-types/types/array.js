import Joi from 'joi';
import memoize from 'lodash.memoize';
import isString from 'lodash.isstring';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setRequired from '../utils/validators/set-required';
import isNumber from '../../../utils/is-number';

export default {
  value : 'array',
  convertIn,
  convertOut,
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  let schema = Joi.string();

  return applyValidators(options, schema, [
    setDefault,
    setRequired
  ]);
}

function convertIn(value) {
  if (Array.isArray(value)) {
    return value.filter(id => isNumber(id)).join(',');
  }

  return value;
}

function convertOut(value) {
  if (isString(value)) {
    return value.split(',');
  }

  return value;
}