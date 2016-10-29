'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNode = require('./create-node');

var _createNode2 = _interopRequireDefault(_createNode);

var _updateNode = require('./update-node');

var _updateNode2 = _interopRequireDefault(_updateNode);

var _removeNode = require('./remove-node');

var _removeNode2 = _interopRequireDefault(_removeNode);

var _pathNode = require('./path-node');

var _pathNode2 = _interopRequireDefault(_pathNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return {
    find: {
      path: (0, _pathNode2.default)(middleware, micro, plugin)
    },
    create: (0, _createNode2.default)(middleware, micro, plugin),
    update: (0, _updateNode2.default)(middleware, micro, plugin),
    delete: (0, _removeNode2.default)(middleware, micro, plugin)
  };
};
//# sourceMappingURL=index.js.map
