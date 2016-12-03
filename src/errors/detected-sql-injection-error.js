import { error } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export const ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;

export default (app, { property, value, ...info }) => {
  const e = error({
    plugin : PLUGIN_SHORT_NAME,
    message: ERROR_DETECTED_SQL_INJECTION,
    ...info
  });
  
  app.log.error(e.message, { property, value, ...info });
  return e;
};