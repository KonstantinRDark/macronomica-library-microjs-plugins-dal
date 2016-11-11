import Joi from 'joi';
import memoize from 'lodash.memoize';
import isString from 'lodash.isstring';
import { Html5Entities } from 'html-entities';
import striptags from 'striptags';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setMinMax from '../utils/validators/set-min-max';
import setRequired from '../utils/validators/set-required';
// Можно посмотреть на: https://github.com/punkave/sanitize-html

const entities = new Html5Entities();

export default {
  value : 'text',
  convertIn,
  convertOut,
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  let schema = Joi.string();

  return applyValidators(options, schema, [
    setMinMax(),
    setDefault,
    setRequired
  ]);
}

function convertIn(value, { format = 'text', ...other } = {}) {
  if (!isString(value)) {
    return value;
  }

  switch (format) {
    case 'text':
      return striptags(value);
    case 'html':
      return entities.encode(value);
    default: return value;
  }
}

function convertOut(value, { format = 'text', ...other } = {}) {
  if (!isString(value)) {
    return value;
  }

  switch (format) {
    case 'html': return entities.decode(value);
    default: return value;
  }
}