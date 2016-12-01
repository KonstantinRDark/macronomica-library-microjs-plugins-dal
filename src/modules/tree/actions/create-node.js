import Schema from './../../../utils/schema';
import { PIN_LIST_CREATE } from './../../constants';
import setParentLeafFalse from '../utils/set-parent-leaf-false';
import { MODULE_NAME } from './../constants';
import {
  internalError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'create-node' };

export default (app, middleware, plugin) => (msg) => buildCreateTreeNode(app, middleware, msg);

export function buildCreateTreeNode (app, middleware, { schema, params = {}, options = {} }) {
  const { parentId = null } = params;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return app
    .act({ ...PIN_LIST_CREATE, schema, params: { ...params, parentId }, options })
    .then(node => setParentLeafFalse(app, schema, parentId)
      .then(() => node)
    )
    .catch(internalError(app, ERROR_INFO));
}