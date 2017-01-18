import Joi from 'joi';
import memoize from 'lodash.memoize';
import isString from 'lodash.isstring';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setRequired from '../utils/validators/set-required';
import isNumber from 'lodash.isnumber';

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
    let result = value.reduce(filterIterator, []).join(',');

    if (isString(result) && result === '') {
      result = null;
    }

    return result;
  }

  return value;
}

function convertOut(value) {
  if (isString(value)) {
    return value === '' ? undefined : value.split(',').map(id => +id);
  }

  return value;
}

function filterIterator(result = [], raw) {
  if (!!raw && typeof raw == 'object') {
    raw = raw.id;
  }

  if (isNumber(raw)) {
    result.push(raw);
  }

  return result;
}