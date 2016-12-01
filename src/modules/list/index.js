import findOne from './actions/find/one';
import findList from './actions/find/list';
import create from './actions/create';
import update from './actions/update';
import count from './actions/count';
import remove from './actions/remove';
import {
  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_COUNTS,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_REMOVE,
} from './../constants';

export default (app, plugin, { middleware, onClose }) => {
  app.add(PIN_LIST_FIND_ONE, findOne(app, middleware, plugin));
  app.add(PIN_LIST_FIND_LIST, findList(app, middleware, plugin));
  app.add(PIN_LIST_COUNTS, count(app, middleware, plugin));
  app.add(PIN_LIST_CREATE, create(app, middleware, plugin));
  app.add(PIN_LIST_UPDATE, update(app, middleware, plugin));
  app.add(PIN_LIST_REMOVE, remove(app, middleware, plugin));

  onClose(handlerOnClose)
}

function handlerOnClose(app) {
  app.del(PIN_LIST_REMOVE);
  app.del(PIN_LIST_UPDATE);
  app.del(PIN_LIST_CREATE);
  app.del(PIN_LIST_COUNTS);
  app.del(PIN_LIST_FIND_LIST);
  app.del(PIN_LIST_FIND_ONE);
}