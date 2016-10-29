'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Types = exports.Schema = undefined;

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _schema = require('./utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _schemaTypes = require('./utils/schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

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

var _tree = require('./actions/tree');

var _tree2 = _interopRequireDefault(_tree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.Schema = _schema2.default;
var Types = exports.Types = _schemaTypes2.default;

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      client = _ref.driver,
      connection = _objectWithoutProperties(_ref, ['driver']);

  return function (micro, name, pluginId) {
    var plugin = { name: name, id: pluginId };
    var middleware = (0, _knex2.default)({
      client: client,
      connection: connection,
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
      Schema: _schema2.default,
      Types: _schemaTypes2.default,
      middleware: middleware,
      actions: {
        tree: (0, _tree2.default)(middleware, micro, plugin),
        find: {
          one: (0, _one2.default)(middleware, micro, plugin),
          list: (0, _list2.default)(middleware, micro, plugin)
        },
        count: (0, _count2.default)(middleware, micro, plugin),
        create: (0, _create2.default)(middleware, micro, plugin),
        update: (0, _update2.default)(middleware, micro, plugin),
        delete: (0, _remove2.default)(middleware, micro, plugin)
      }
    };
  };
};
//# sourceMappingURL=index.js.map
