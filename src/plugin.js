import { genid } from '@micro/microjs';
import knex from 'knex';
import methods from './methods';
import modules from './modules';

export default ({ driver:client, ...connection } = {}) => {
  return (app, { onClose }) => {
    const plugin = { id: genid(), schema: (name) => {} };
    const middleware = knex({
      client,
      connection,
      useNullAsDefault: true
    });

    methods(app, plugin, { middleware, onClose });
    modules(app, plugin, { middleware, onClose });
  };
};