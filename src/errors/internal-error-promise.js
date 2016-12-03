import { internalError } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export default (app, info = {}) => {
  return (err) => {
    const e = internalError({ plugin: PLUGIN_SHORT_NAME, ...info });
    app.log.error(e.message, err);
    return Promise.reject(e);
  };
};