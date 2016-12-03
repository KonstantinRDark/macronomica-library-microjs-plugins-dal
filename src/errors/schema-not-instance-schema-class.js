import { error } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;

export default (info = {}) => {
  return error({
    plugin : PLUGIN_SHORT_NAME,
    message: ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS,
    ...info
  });
};