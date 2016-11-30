import {buildFindOne} from './../find/one';
import {buildUpdate} from './../update';
import {buildRemove} from './../remove';
import setParentLeafTrue from './utils/set-parent-leaf-true';

export default (middleware, micro, plugin) =>
  (schema, criteria, options) =>
    buildRemoveTreeNode(middleware, schema, criteria, options);

export function buildRemoveTreeNode (middleware, schema, criteria = {}, options = {}) {
  const { id } = criteria;

  if (!id) {
    return Promise.reject({
      code   : 'error.plugin.dal/remove-node.id.property.is.required',
      message: 'Для удаления свойство "id" обязательно'
    });
  }

  // Сначала получить свои id и parentId
  return buildFindOne(middleware, schema, { id }, { fields: [ 'id', 'parentId', 'leaf' ] })
    .then(node => {
      if (!node) {
        return node;
      }

      // Удаляем себя
      return buildRemove(middleware, schema, { id }, options)
        .then(removedRows => {
          if (removedRows) {
            return buildUpdate(middleware, schema, { parentId: id }, { parentId: node.parentId }, options);
          }

          return removedRows;
        })
        // Проверить остались ли у родителя дети если нет - заменить ему leaf на true
        .then(result => setParentLeafTrue(middleware, schema, node.parentId)
          .then(() => result)
        );
    });
}