import error, { ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS } from './error';

export default (info = {}) => {
  return error({ message: ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS, ...info });
};