import findOne from './actions/find/one';
import findList from './actions/find/list';
import create from './actions/create';
import update from './actions/update';
import count from './actions/count';
import remove from './actions/remove';

export default (app, plugin, { middleware, onClose }) => {
  app.add('cmd:actions, action:find.one', findOne(middleware, app, plugin));
  app.add('cmd:actions, action:find.list', findList(middleware, app, plugin));
  app.add('cmd:actions, action:count', count(middleware, app, plugin));
  app.add('cmd:actions, action:create, schema:*, params:*', create(app, middleware, plugin));
  app.add('cmd:actions, action:update', update(middleware, app, plugin));
  app.add('cmd:actions, action:remove', remove(middleware, app, plugin));
}