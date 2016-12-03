import { internalError } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export default (app, info = {}) => {
  return (err) => internalError({ plugin: PLUGIN_SHORT_NAME, ...info })(err);
};