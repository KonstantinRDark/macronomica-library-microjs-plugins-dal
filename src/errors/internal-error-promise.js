import { internalErrorPromise } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export default (app, info = {}) => {
  return (err) => internalErrorPromise(app, { plugin: PLUGIN_SHORT_NAME, ...info })(err);
};