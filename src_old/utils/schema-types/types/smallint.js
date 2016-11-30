import Joi from 'joi';
import memoize from 'lodash.memoize';
import { MIN_SMALLINT, MAX_SMALLINT } from '../utils/constants';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setMinMax from '../utils/validators/set-min-max';
import setRequired from '../utils/validators/set-required';

export default {
  value : 'smallint',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  const schema = Joi.number().integer();
  return applyValidators(options, schema, [
    setDefault,
    setRequired,
    setMinMax({ min: MIN_SMALLINT, max: MAX_SMALLINT })
  ]);
}