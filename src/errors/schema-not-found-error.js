import { error } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export const ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;

export default (info = {}) => {
  return error({
    plugin : PLUGIN_SHORT_NAME,
    message: ERROR_SCHEMA_NOT_FOUND,
    ...info
  });
};