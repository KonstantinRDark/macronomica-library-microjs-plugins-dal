import knex from 'knex';
import Schema from './utils/schema';
import SchemaTypes from './utils/schema-types';
import findOne from './actions/find/one';
import findList from './actions/find/list';
import create from './actions/create';
import update from './actions/update';
import count from './actions/count';
import remove from './actions/remove';
import tree from './actions/tree';

export { Schema };
export const Types = SchemaTypes;
export const middleware = knex;

export default ({ driver:client, ...connection } = {}) => (micro, name, pluginId) => {
  const plugin = { name, id: pluginId };
  const middleware = knex({
    client,
    connection,
    useNullAsDefault: true
  });

  // micro
  //   .queue({
  //     case: 'wait',
  //     args: [],
  //     done: () => !handleListen ? Promise.resolve() : handleListen.listen()
  //   })
  //   .queue({
  //     case: 'close',
  //     args: [],
  //     done: () => !handleListen ? Promise.resolve() : handleListen.close()
  //   });

  return {
    Schema,
    Types: SchemaTypes,
    middleware,
    actions: {
      tree: tree(middleware, micro, plugin),
      find: {
        one : findOne(middleware, micro, plugin),
        list: findList(middleware, micro, plugin)
      },
      count : count(middleware, micro, plugin),
      create: create(middleware, micro, plugin),
      update: update(middleware, micro, plugin),
      remove: remove(middleware, micro, plugin)
    }
  }
}