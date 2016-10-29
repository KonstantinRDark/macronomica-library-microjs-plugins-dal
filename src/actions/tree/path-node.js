import {buildFindOne} from './../find/one';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildPathTreeNode(middleware, schema, params, options);

// Загружаем одну ноду по Id
// Если нет parentId возвращаем родителей
// Иначе вызовем этот метод с id == parentId
const childrenPath = (middleware, schema, id = null, parents = []) => {
  return buildFindOne(middleware, schema, { id })
    .then(parent => {
      const { parentId } = parent;

      parents.push(parent);

      // Если нет родителя - вернем список загруженных родителей
      if (!parentId) {
        return parents;
      }

      // Иначе запустим загрузку родителя
      return childrenPath(middleware, schema, parentId, parents);
    });
};

export function buildPathTreeNode(middleware, schema, criteria = {}, options = {}) {
  const { id } = criteria;
  const parents = [];

  if (!id) {
    return Promise.resolve(parents);
  }

  // Загружаем себя
  return buildFindOne(middleware, schema, { id }, { fields: [ 'id', 'parentId' ] })
    .then(parent => {
      const { parentId } = parent;

      // Если нет родителей - вернем пустой массив родителей
      if (!parentId) {
        return parents;
      }

      // Иначе запустим загрузку родителей
      return childrenPath(middleware, schema, parentId, parents);
    })
    .then(parents => parents.sort((a, b) => a.id - b.id));
}