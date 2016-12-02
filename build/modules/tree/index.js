'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNode = require('./actions/create-node');

var _createNode2 = _interopRequireDefault(_createNode);

var _updateNode = require('./actions/update-node');

var _updateNode2 = _interopRequireDefault(_updateNode);

var _removeNode = require('./actions/remove-node');

var _removeNode2 = _interopRequireDefault(_removeNode);

var _path = require('./actions/find/path');

var _path2 = _interopRequireDefault(_path);

var _parents = require('./actions/find/parents');

var _parents2 = _interopRequireDefault(_parents);

var _pins = require('../../pins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, plugin, _ref) => {
  let middleware = _ref.middleware,
      onClose = _ref.onClose;

  app.add(_pins.PIN_TREE_FIND_PARENTS, (0, _parents2.default)(app, middleware, plugin));
  app.add(_pins.PIN_TREE_FIND_PATH, (0, _path2.default)(app, middleware, plugin));
  app.add(_pins.PIN_TREE_CREATE, (0, _createNode2.default)(app, middleware, plugin));
  app.add(_pins.PIN_TREE_UPDATE, (0, _updateNode2.default)(app, middleware, plugin));
  app.add(_pins.PIN_TREE_REMOVE, (0, _removeNode2.default)(app, middleware, plugin));

  onClose(handlerOnClose);
};

function handlerOnClose(app) {
  app.del(_pins.PIN_TREE_REMOVE);
  app.del(_pins.PIN_TREE_UPDATE);
  app.del(_pins.PIN_TREE_CREATE);
  app.del(_pins.PIN_TREE_FIND_PATH);
  app.del(_pins.PIN_TREE_FIND_PARENTS);
}
//# sourceMappingURL=index.js.map