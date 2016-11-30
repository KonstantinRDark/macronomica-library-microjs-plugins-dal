import Joi from 'joi';
import isFunction from 'lodash.isfunction';

export default function setDefault(options, schema) {

  if ('default' in options) {
    if (isFunction(options.default) || !Joi.validate(options.default, schema).error) {
      schema = schema.default(options.default);
    }
  }

  return schema;
}