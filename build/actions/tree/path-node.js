'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPathTreeNode = buildPathTreeNode;

var _one = require('./../find/one');

exports.default = function (middleware, micro, plugin) {
  return function (schema, params, options) {
    return buildPathTreeNode(middleware, schema, params, options);
  };
};

// Загружаем одну ноду по Id
// Если нет parentId возвращаем родителей
// Иначе вызовем этот метод с id == parentId


var childrenPath = function childrenPath(middleware, schema) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var parents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  return (0, _one.buildFindOne)(middleware, schema, { id: id }).then(function (parent) {
    var parentId = parent.parentId;


    parents.push(parent);

    // Если нет родителя - вернем список загруженных родителей
    if (!parentId) {
      return parents;
    }

    // Иначе запустим загрузку родителя
    return childrenPath(middleware, schema, parentId, parents);
  });
};

function buildPathTreeNode(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var id = criteria.id;

  var parents = [];

  if (!id) {
    return Promise.resolve(parents);
  }

  // Загружаем себя
  return (0, _one.buildFindOne)(middleware, schema, { id: id }, { fields: ['id', 'parentId'] }).then(function (parent) {
    var parentId = parent.parentId;

    // Если нет родителей - вернем пустой массив родителей

    if (!parentId) {
      return parents;
    }

    // Иначе запустим загрузку родителей
    return childrenPath(middleware, schema, parentId, parents);
  }).then(function (parents) {
    return parents.sort(function (a, b) {
      return a.id - b.id;
    });
  });
}
//# sourceMappingURL=path-node.js.map