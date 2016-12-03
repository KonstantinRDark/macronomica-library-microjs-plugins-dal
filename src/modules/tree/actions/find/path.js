import Schema from '../../../../utils/schema';
import { PIN_LIST_FIND_ONE } from '../../../../pins';
import { MODULE_NAME } from '../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-path' };

export default (app, middleware, plugin) => (msg) => buildFindPathTreeNodes(app, middleware, msg);

export function buildFindPathTreeNodes(app, middleware, { schema, criteria = {}, options = {} }) {
  const { id } = criteria;
  const parents = [];

  if (!id) {
    return Promise.resolve(parents);
  }

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  // Загружаем себя
  return app
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'parentId', 'leaf' ] }
    })
    .then(parent => {
      const { parentId } = parent;

      // Если нет родителей - вернем пустой массив родителей
      if (!parentId) {
        return parents;
      }

      // Иначе запустим загрузку родителей
      return childrenPath(app, schema, parentId, parents);
    })
    .then(parents => parents.sort((a, b) => a.id - b.id))
    .catch(internalErrorPromise(app, ERROR_INFO));
}

// Загружаем одну ноду по Id
// Если нет parentId возвращаем родителей
// Иначе вызовем этот метод с id == parentId
function childrenPath(app, schema, id = null, parents = []) {
  return app
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'parentId', 'leaf' ] }
    })
    .then(parent => {
      const { parentId } = parent;

      parents.push(parent);

      // Если нет родителя - вернем список загруженных родителей
      if (!parentId) {
        return parents;
      }

      // Иначе запустим загрузку родителя
      return childrenPath(app, schema, parentId, parents);
    });
}