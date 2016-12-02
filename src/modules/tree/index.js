import createNode from './actions/create-node';
import updateNode from './actions/update-node';
import removeNode from './actions/remove-node';
import findPath from './actions/find/path';
import findParents from './actions/find/parents';
import {
  PIN_TREE_FIND_PARENTS,
  PIN_TREE_FIND_PATH,
  PIN_TREE_CREATE,
  PIN_TREE_UPDATE,
  PIN_TREE_REMOVE,
} from '../../pins';

export default (app, plugin, { middleware, onClose }) => {
  app.add(PIN_TREE_FIND_PARENTS, findParents(app, middleware, plugin));
  app.add(PIN_TREE_FIND_PATH, findPath(app, middleware, plugin));
  app.add(PIN_TREE_CREATE, createNode(app, middleware, plugin));
  app.add(PIN_TREE_UPDATE, updateNode(app, middleware, plugin));
  app.add(PIN_TREE_REMOVE, removeNode(app, middleware, plugin));

  onClose(handlerOnClose)
}

function handlerOnClose(app) {
  app.del(PIN_TREE_REMOVE);
  app.del(PIN_TREE_UPDATE);
  app.del(PIN_TREE_CREATE);
  app.del(PIN_TREE_FIND_PATH);
  app.del(PIN_TREE_FIND_PARENTS);
}