import { ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS } from './../constants';
import error from './error';

export default ({ module, action }) => {
  return error({ message: ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS, module, action });
};