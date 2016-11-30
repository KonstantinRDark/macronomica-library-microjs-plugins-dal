import createNode from './create-node';
import updateNode from './update-node';
import removeNode from './remove-node';
import pathNode from './path-node';

export default (middleware, micro, plugin) => {
  return {
    find  : {
      path: pathNode(middleware, micro, plugin)
    },
    create: createNode(middleware, micro, plugin),
    update: updateNode(middleware, micro, plugin),
    remove: removeNode(middleware, micro, plugin)
  }
}