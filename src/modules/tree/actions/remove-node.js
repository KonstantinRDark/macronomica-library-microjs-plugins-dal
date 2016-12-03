import Schema from '../../../utils/schema';
import setParentLeafTrue from '../utils/set-parent-leaf-true';
import { MODULE_NAME } from './../constants';
import {
  PIN_LIST_FIND_ONE,
  PIN_LIST_UPDATE,
  PIN_LIST_REMOVE
} from '../../../pins';
import {
  internalErrorPromise,
  propertyIsRequiredError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'remove-node' };

export default (app, middleware, plugin) => (msg) => buildRemoveTreeNode(app, middleware, msg);

export function buildRemoveTreeNode (app, middleware, { schema, criteria = {}, options = {} }) {
  const { id } = criteria;

  if (!id) {
    return Promise.reject(propertyIsRequiredError({ ...ERROR_INFO, property: 'criteria.id' }));
  }

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  // Сначала получить свои id и parentId
  return app
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'parentId', 'leaf' ] }
    })
    // Удаляем себя
    .then(removeNode(app, id, schema, options))
    .catch(internalErrorPromise(app, ERROR_INFO));
}

function removeNode(app, id, schema, options) {
  return node => {
    if (!node) { return node }

    return app
      .act({ ...PIN_LIST_REMOVE, schema, criteria: { id }, options })
      .then(updateParent(app, node, id, schema, options))
      // Проверить остались ли у родителя дети если нет - заменить ему leaf на true
      .then(result => setParentLeafTrue(app, schema, node.parentId)
        .then(() => result)
      );
  };
}

function updateParent(app, node, id, schema, options) {
  return removedRows => {
    if (removedRows) {
      let params = { parentId: node.parentId };
      return app.act({ ...PIN_LIST_UPDATE, schema, criteria: { parentId: id }, params, options });
    }

    return removedRows;
  }
}