import Joi from 'joi';
import memoize from 'lodash.memoize';
import { MIN_INTEGER, MAX_INTEGER } from '../utils/constants';
import applyValidators from '../utils/apply-validators';
import setDefault from '../utils/validators/set-default';
import setMinMax from '../utils/validators/set-min-max';
import setRequired from '../utils/validators/set-required';
import isNumber from 'lodash.isnumber';

export default {
  value : 'float',
  schema: memoize(schemaValidate)
};

function schemaValidate(options = Object.create(null)) {
  const defaultLimitMin = 0;
  const defaultLimitMax = 15;
  const defaultLimit = 6;
  let { limit = defaultLimit } = options;

  if (!isNumber(limit)) {
    limit = defaultLimit;
  } else {
    if (limit < defaultLimitMin) { limit = defaultLimitMin }
    if (limit > defaultLimitMax) { limit = defaultLimitMax }
  }

  const schema = Joi.number().precision(limit);

  return applyValidators(options, schema, [
    setDefault,
    setRequired,
    setMinMax({ min: MIN_INTEGER, max: MAX_INTEGER })
  ]);
}