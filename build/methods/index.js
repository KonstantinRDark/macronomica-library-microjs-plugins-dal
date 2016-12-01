'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schemaSet = require('./schema-set');

var _schemaSet2 = _interopRequireDefault(_schemaSet);

var _schemaGet = require('./schema-get');

var _schemaGet2 = _interopRequireDefault(_schemaGet);

var _schemaDel = require('./schema-del');

var _schemaDel2 = _interopRequireDefault(_schemaDel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const setSchemaPin = 'role:plugin-dal, action:schema-set, name:*, schema:*';
const getSchemaPin = 'role:plugin-dal, action:schema-get, name:*';
const delSchemaPin = 'role:plugin-dal, action:schema-del, name:*';

exports.default = (app, plugin, _ref) => {
  let onClose = _ref.onClose;


  app.add(setSchemaPin, (0, _schemaSet2.default)(app, plugin));
  app.add(getSchemaPin, (0, _schemaGet2.default)(app, plugin));
  app.add(delSchemaPin, (0, _schemaDel2.default)(app, plugin));

  onClose(handlerOnClose);
};

function handlerOnClose(app) {
  app.add(setSchemaPin).add(getSchemaPin).add(delSchemaPin);
}
//# sourceMappingURL=index.js.map