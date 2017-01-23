'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildFindPathTreeNodes = buildFindPathTreeNodes;

var _schema = require('../../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _pins = require('../../../../pins');

var _constants = require('../../constants');

var _errors = require('../../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'find-path' };

exports.default = (app, middleware, plugin) => msg => buildFindPathTreeNodes(app, middleware, msg);

function buildFindPathTreeNodes(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const id = criteria.id;

  const parents = [];

  if (!id) {
    return _promise2.default.resolve(parents);
  }

  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  // Загружаем себя
  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId', 'leaf'] }
  })).then(parent => {
    const parentId = parent.parentId;

    // Если нет родителей - вернем пустой массив родителей

    if (!parentId) {
      return parents;
    }

    // Иначе запустим загрузку родителей
    return childrenPath(app, schema, parentId, parents);
  }).then(parents => parents.sort((a, b) => a.id - b.id)).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO));
}

// Загружаем одну ноду по Id
// Если нет parentId возвращаем родителей
// Иначе вызовем этот метод с id == parentId
function childrenPath(app, schema) {
  let id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let parents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId', 'leaf'] }
  })).then(parent => {
    const parentId = parent.parentId;


    parents.push(parent);

    // Если нет родителя - вернем список загруженных родителей
    if (!parentId) {
      return parents;
    }

    // Иначе запустим загрузку родителя
    return childrenPath(app, schema, parentId, parents);
  });
}
//# sourceMappingURL=path.js.map