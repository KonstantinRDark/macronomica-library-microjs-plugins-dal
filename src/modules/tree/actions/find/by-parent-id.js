import isString from 'lodash.isstring';
import Schema from './../../../../utils/schema';
import { PIN_LIST_FIND_LIST } from '../../../../pins';
import { MODULE_NAME } from './../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-parent-id' };

export default (app, middleware, plugin) => (msg) => buildFindByParentIdTreeNodes(app, middleware, msg);

export function buildFindByParentIdTreeNodes(app, middleware, { schema, criteria = {}, options = {} }) {
  let { parentId } = criteria;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  if (!parentId || parentId === '' || (isString(parentId) && parentId.toLowerCase() === 'null')) {
    parentId = null;
  }

  // Загружаем себя
  return app.act({
    ...PIN_LIST_FIND_LIST,
    schema,
    options,
    criteria: { parentId }
  })
  .catch(internalErrorPromise(app, ERROR_INFO));
}