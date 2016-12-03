import { propertyIsRequredError } from '@microjs/microjs';
import { PLUGIN_SHORT_NAME } from './../constants';

export default (info = {}) => {
  return propertyIsRequredError({ plugin: PLUGIN_SHORT_NAME, ...info });
};