import Joi from 'joi';
import memoize from 'lodash.memoize';
import isPlainObject from 'lodash.isplainobject';
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
    let result = value
      .filter(filterIterator)
      .join(',');

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

function filterIterator(raw) {
  if (isPlainObject(raw)) {
    raw = raw.id;
  }

  if (isNumber(raw)) {
    return raw;
  }

  return false;
}