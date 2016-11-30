import Joi from 'joi';
import memoize from 'lodash.memoize';
import { MAX_INTEGER } from '../utils/constants';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setMinMax from '../utils/validators/set-min-max';
import setRequired from '../utils/validators/set-required';

export default {
  value : 'number',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  const schema = Joi.number().integer().positive();
  return applyValidators(options, schema, [
    setDefault,
    setRequired,
    setMinMax({ min: 0, max: MAX_INTEGER })
  ]);
}