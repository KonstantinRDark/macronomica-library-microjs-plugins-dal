import Joi from 'joi';
import memoize from 'lodash.memoize';
import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isNumber from 'lodash.isnumber';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setRequired from '../utils/validators/set-required';

export default {
  value : 'boolean',
  schema: memoize(schemaValidate),
  convertIn,
  convertOut,
};

function schemaValidate(options = Object.create(null)) {
  return applyValidators(options, Joi.boolean(), [
    setDefault,
    setRequired
  ]);
}

function convertIn(value, options) {
  if (isString(value)) {
    value = value.toLowerCase() === 'true' ? true : options.default;
  }

  if (isBoolean(value)) {
    value = !!value ? 1 : 0;
  }

  return value;
}

function convertOut(value) {
  if (isNumber(value)) {
    value = value === 1;
  }

  return value;
}