import { genid } from '@microjs/microjs';
import knex from 'knex';
import modules from './modules';
import { PIN_OPTIONS, PIN_CONNECTION } from './constants';

export default ({ driver:client, ...connection } = {}) => {
  return (app, { onClose }) => {
    const plugin = { id: genid(), schema: (name) => {} };
    const options = {
      client,
      connection,
      useNullAsDefault: true
    };
    const middleware = knex(options);

    app.add(PIN_OPTIONS, ({ }) => Promise.resolve(options));
    app.add(PIN_CONNECTION, ({ }) => Promise.resolve(middleware));

    modules(app, plugin, { middleware, onClose });

    onClose(handlerOnClose);
  };
};

function handlerOnClose(app) {
  app.del(PIN_CONNECTION);
  app.del(PIN_OPTIONS);
}