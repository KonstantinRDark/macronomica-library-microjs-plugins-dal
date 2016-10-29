import {buildCreate} from './../create';
import setParentLeafFalse from './utils/set-parent-leaf-false';

export default (middleware, micro, plugin) =>
  (schema, params, options) =>
    buildCreateTreeNode(middleware, schema, params, options);

export function buildCreateTreeNode (middleware, schema, params = {}, options = {}) {
  const { parentId = null } = params;

  return buildCreate(middleware, schema, { ...params, parentId }, options)
    .then(node => setParentLeafFalse(middleware, schema, parentId)
      .then(() => node)
    );
}