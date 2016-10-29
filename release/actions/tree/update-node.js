'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUpdateTreeNode = buildUpdateTreeNode;

var _update = require('./../update');

var _one = require('./../find/one');

var _setParentLeafTrue = require('./utils/set-parent-leaf-true');

var _setParentLeafTrue2 = _interopRequireDefault(_setParentLeafTrue);

var _setParentLeafFalse = require('./utils/set-parent-leaf-false');

var _setParentLeafFalse2 = _interopRequireDefault(_setParentLeafFalse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, params, options) {
    return buildUpdateTreeNode(middleware, schema, params, options);
  };
};

function buildUpdateTreeNode(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var id = criteria.id;
  var parentId = params.parentId;


  if (!id) {
    return Promise.reject({
      code: 'error.plugin.rest-tree/update-node.id.property.is.required',
      message: 'Для обновления свойство "id" обязательно'
    });
  }

  // Если не передали parentId - дальнейшая логика излишняя
  if (!parentId || !isFinite(+parentId)) {
    return (0, _update.buildUpdate)(middleware, schema, { id: id }, params, options);
  }

  return (0, _one.buildFindOne)(middleware, schema, { id: id }, { fields: ['id', 'parentId'] }).then(function (node) {
    if (!node) {
      return node;
    }

    return (0, _update.buildUpdate)(middleware, schema, { id: id }, params, options).then(function (updated) {
      // Если новый parentId не равен старому
      if (node.parentId !== +parentId) {
        return Promise.all([
        // Проверить остались ли у родителя дети, если нет - заменить ему leaf на true
        (0, _setParentLeafTrue2.default)(middleware, schema, node.parentId),
        // Заменить текущему родителю leaf на false если это первый его ребенок
        (0, _setParentLeafFalse2.default)(middleware, schema, parentId)]).then(function () {
          return updated;
        }).catch(function (error) {
          console.error(error);
        });
      }

      return updated;
    });
  });
}
//# sourceMappingURL=update-node.js.map
