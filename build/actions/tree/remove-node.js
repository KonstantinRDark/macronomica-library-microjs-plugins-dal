'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRemoveTreeNode = buildRemoveTreeNode;

var _one = require('./../find/one');

var _update = require('./../update');

var _remove = require('./../remove');

var _setParentLeafTrue = require('./utils/set-parent-leaf-true');

var _setParentLeafTrue2 = _interopRequireDefault(_setParentLeafTrue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, criteria, options) {
    return buildRemoveTreeNode(middleware, schema, criteria, options);
  };
};

function buildRemoveTreeNode(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var id = criteria.id;


  if (!id) {
    return Promise.reject({
      code: 'error.plugin.dal/remove-node.id.property.is.required',
      message: 'Для удаления свойство "id" обязательно'
    });
  }

  // Сначала получить свои id и parentId
  return (0, _one.buildFindOne)(middleware, schema, { id: id }, { fields: ['id', 'parentId', 'leaf'] }).then(function (node) {
    if (!node) {
      return node;
    }

    // Удаляем себя
    return (0, _remove.buildRemove)(middleware, schema, { id: id }, options).then(function (removedRows) {
      if (removedRows) {
        return (0, _update.buildUpdate)(middleware, schema, { parentId: id }, { parentId: node.parentId }, options);
      }

      return removedRows;
    })
    // Проверить остались ли у родителя дети если нет - заменить ему leaf на true
    .then(function (result) {
      return (0, _setParentLeafTrue2.default)(middleware, schema, node.parentId).then(function () {
        return result;
      });
    });
  });
}
//# sourceMappingURL=remove-node.js.map