import * as pins from './../../pins';

export default (app, plugin, { middleware, onClose }) => {
  app.add(pins.PIN_CASCADE_SAVE_ONE, require('./actions/save-one').default);
  app.add(pins.PIN_CASCADE_SAVE_MANY, require('./actions/save-many').default);
  app.add(pins.PIN_CASCADE_REMOVE, require('./actions/remove').default);
};