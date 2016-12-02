import error, { ERROR_PROPERTY_IS_REQUIRED } from './error';

export default ({ property, ...info }) => {
  return error({ message: `${ property }.${ ERROR_PROPERTY_IS_REQUIRED }`, ...info });
};