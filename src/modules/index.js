import listModule from './list';
import treeModule from './tree';

export default (app, plugin, { middleware, onClose }) => {
  listModule(app, plugin, { middleware, onClose });
  treeModule(app, plugin, { middleware, onClose });
}