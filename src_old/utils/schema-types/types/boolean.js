import Joi from 'joi';
import memoize from 'lodash.memoize';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setRequired from '../utils/validators/set-required';

export default {
  value : 'boolean',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  return applyValidators(options, Joi.boolean(), [
    setDefault,
    setRequired
  ]);
}