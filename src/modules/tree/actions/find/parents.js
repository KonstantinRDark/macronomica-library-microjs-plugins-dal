import Schema from './../../../../utils/schema';
import { PIN_LIST_FIND_LIST } from './../../../constants';
import { MODULE_NAME } from './../../constants';
import {
  internalError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-parents' };

export default (app, middleware, plugin) => (msg) => buildFindParentsTreeNodes(app, middleware, msg);

export function buildFindParentsTreeNodes(app, middleware, { schema, criteria = {}, options = {} }) {
  let { parentId } = criteria;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  if (!parentId || parentId === '' || parentId.toLowerCase() === 'null') {
    parentId = null;
  }

  // Загружаем себя
  return app.act({
    ...PIN_LIST_FIND_LIST,
    schema,
    options,
    criteria: { parentId }
  })
  .catch(internalError(app, ERROR_INFO));
}