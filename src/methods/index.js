import setSchemaMethod from './schema-set';
import getSchemaMethod from './schema-get';
import delSchemaMethod from './schema-del';

const setSchemaPin = 'role:plugin-dal, action:schema-set, name:*, schema:*';
const getSchemaPin = 'role:plugin-dal, action:schema-get, name:*';
const delSchemaPin = 'role:plugin-dal, action:schema-del, name:*';

export default (app, plugin, { onClose }) => {

  app.add(setSchemaPin, setSchemaMethod(app, plugin));
  app.add(getSchemaPin, getSchemaMethod(app, plugin));
  app.add(delSchemaPin, delSchemaMethod(app, plugin));

  onClose(handlerOnClose);
}

function handlerOnClose(app) {
  app
    .add(setSchemaPin)
    .add(getSchemaPin)
    .add(delSchemaPin);
}