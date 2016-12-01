import {
  ERROR_SEPARATOR,
  ERROR_PREFIX
} from './../constants';

export default ({ module = '-', action = '-', message = '-' }) => {
  return new Error([
    ERROR_PREFIX,
    module,
    action,
    message
  ].join(ERROR_SEPARATOR));
};