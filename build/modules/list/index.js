'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _one = require('./actions/find/one');

var _one2 = _interopRequireDefault(_one);

var _list = require('./actions/find/list');

var _list2 = _interopRequireDefault(_list);

var _create = require('./actions/create');

var _create2 = _interopRequireDefault(_create);

var _update = require('./actions/update');

var _update2 = _interopRequireDefault(_update);

var _count = require('./actions/count');

var _count2 = _interopRequireDefault(_count);

var _remove = require('./actions/remove');

var _remove2 = _interopRequireDefault(_remove);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, plugin, _ref) => {
  let middleware = _ref.middleware,
      onClose = _ref.onClose;

  app.add(_constants.PIN_LIST_FIND_ONE, (0, _one2.default)(app, middleware, plugin));
  app.add(_constants.PIN_LIST_FIND_LIST, (0, _list2.default)(app, middleware, plugin));
  app.add(_constants.PIN_LIST_COUNTS, (0, _count2.default)(app, middleware, plugin));
  app.add(_constants.PIN_LIST_CREATE, (0, _create2.default)(app, middleware, plugin));
  app.add(_constants.PIN_LIST_UPDATE, (0, _update2.default)(app, middleware, plugin));
  app.add(_constants.PIN_LIST_REMOVE, (0, _remove2.default)(app, middleware, plugin));

  onClose(handlerOnClose);
};

function handlerOnClose(app) {
  app.del(_constants.PIN_LIST_REMOVE);
  app.del(_constants.PIN_LIST_UPDATE);
  app.del(_constants.PIN_LIST_CREATE);
  app.del(_constants.PIN_LIST_COUNTS);
  app.del(_constants.PIN_LIST_FIND_LIST);
  app.del(_constants.PIN_LIST_FIND_ONE);
}
//# sourceMappingURL=index.js.map