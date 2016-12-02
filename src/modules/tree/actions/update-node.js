import Schema from '../../../utils/schema';
import setParentLeafTrue from '../utils/set-parent-leaf-true';
import setParentLeafFalse from '../utils/set-parent-leaf-false';
import { MODULE_NAME } from './../constants';
import {
  PIN_LIST_FIND_ONE,
  PIN_LIST_UPDATE
} from '../../../pins';
import {
  internalError,
  propertyIsRequiredError,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'update-node' };

export default (app, middleware, plugin) => (msg) => buildUpdateTreeNode(app, middleware, msg);

export function buildUpdateTreeNode(app, middleware, { schema, criteria = {}, params = {}, options = {} }) {
  const { id } = criteria;
  const { parentId } = params;

  if (!id) {
    return Promise.reject(propertyIsRequiredError({ ...ERROR_INFO, property: 'criteria.id' }));
  }

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  // Если не передали parentId - дальнейшая логика излишняя
  if (!parentId || !isFinite(+parentId)) {
    return app.act({ ...PIN_LIST_UPDATE, schema, criteria: { id }, params, options });
  }

  return app
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'parentId' ] }
    })
    .then(node => {
      if (!node) { return node }

      return app
        .act({ ...PIN_LIST_UPDATE, schema, criteria: { id }, params, options })
        .then(updated => {
          // Если новый parentId не равен старому
          if (node.parentId !== +parentId) {
            return Promise
              .all([
                // Проверить остались ли у родителя дети, если нет - заменить ему leaf на true
                setParentLeafTrue(app, schema, node.parentId),
                // Заменить текущему родителю leaf на false если это первый его ребенок
                setParentLeafFalse(app, schema, parentId)
              ])
              .then(() => updated);
          }

          return updated;
        });
    })
    .catch(internalError(app, ERROR_INFO));
}