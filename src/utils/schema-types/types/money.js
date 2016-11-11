import Joi from 'joi';
import memoize from 'lodash.memoize';
import { MIN_MONEY, MAX_MONEY } from '../utils/constants';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setRequired from '../utils/validators/set-required';

export default {
  value : 'money',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  const schema = Joi.number().precision(2).min(MIN_MONEY).max(MAX_MONEY);
  return applyValidators(options, schema, [
    setDefault,
    setRequired
  ]);
}