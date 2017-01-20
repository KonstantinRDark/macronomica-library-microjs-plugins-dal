'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

var _cascade = require('./cascade');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, plugin, _ref) => {
  let middleware = _ref.middleware,
      onClose = _ref.onClose;

  (0, _list2.default)(app, plugin, { middleware, onClose });
  (0, _tree2.default)(app, plugin, { middleware, onClose });
  (0, _cascade2.default)(app, plugin, { middleware, onClose });
};
//# sourceMappingURL=index.js.map