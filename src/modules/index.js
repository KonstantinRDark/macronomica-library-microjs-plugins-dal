import listModule from './list';
import treeModule from './tree';
import cascadeModule from './cascade';

export default (app, plugin, { middleware, onClose }) => {
  listModule(app, plugin, { middleware, onClose });
  treeModule(app, plugin, { middleware, onClose });
  cascadeModule(app, plugin, { middleware, onClose });
}