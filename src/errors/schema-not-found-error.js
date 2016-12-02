import error, { ERROR_SCHEMA_NOT_FOUND } from './error';

export default (info = {}) => {
  return error({ message: ERROR_SCHEMA_NOT_FOUND, ...info });
};