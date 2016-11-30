import {buildUpdate} from './../update';
import {buildFindOne} from './../find/one';
import setParentLeafTrue from './utils/set-parent-leaf-true';
import setParentLeafFalse from './utils/set-parent-leaf-false';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildUpdateTreeNode(middleware, schema, params, options);

export function buildUpdateTreeNode(middleware, schema, criteria = {}, params = {}, options = {}) {
  const { id } = criteria;
  const { parentId } = params;

  if (!id) {
    return Promise.reject({
      code   : 'error.plugin.rest-tree/update-node.id.property.is.required',
      message: 'Для обновления свойство "id" обязательно'
    });
  }

  // Если не передали parentId - дальнейшая логика излишняя
  if (!parentId || !isFinite(+parentId)) {
    return buildUpdate(middleware, schema, { id }, params, options);
  }

  return buildFindOne(middleware, schema, { id }, { fields: [ 'id', 'parentId' ] })
    .then(node => {
      if (!node) {
        return node;
      }

      return buildUpdate(middleware, schema, { id }, params, options)
        .then(updated => {
          // Если новый parentId не равен старому
          if (node.parentId !== +parentId) {
            return Promise
              .all([
                // Проверить остались ли у родителя дети, если нет - заменить ему leaf на true
                setParentLeafTrue(middleware, schema, node.parentId),
                // Заменить текущему родителю leaf на false если это первый его ребенок
                setParentLeafFalse(middleware, schema, parentId)
              ])
              .then(() => updated)
              .catch(error => {
                console.error(error);
              });
          }

          return updated;
        });
    });
}