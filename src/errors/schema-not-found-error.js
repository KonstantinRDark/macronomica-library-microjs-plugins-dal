import { ERROR_SCHEMA_NOT_FOUND } from './../constants';
import error from './error';

export default (info = {}) => {
  return error({ message: ERROR_SCHEMA_NOT_FOUND, ...info });
};