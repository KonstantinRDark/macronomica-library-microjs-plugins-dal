'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildRemoveTreeNode = buildRemoveTreeNode;

var _schema = require('../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setParentLeafTrue = require('../utils/set-parent-leaf-true');

var _setParentLeafTrue2 = _interopRequireDefault(_setParentLeafTrue);

var _constants = require('./../constants');

var _pins = require('../../../pins');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'remove-node' };

exports.default = (app, middleware, plugin) => msg => buildRemoveTreeNode(app, middleware, msg);

function buildRemoveTreeNode(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const id = criteria.id;


  if (!id) {
    return Promise.reject((0, _errors.propertyIsRequiredError)(_extends({}, ERROR_INFO, { property: 'criteria.id' })));
  }

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  // Сначала получить свои id и parentId
  return app.act(_extends({}, _pins.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId', 'leaf'] }
  }))
  // Удаляем себя
  .then(removeNode(app, id, schema, options)).catch((0, _errors.internalError)(app, ERROR_INFO));
}

function removeNode(app, id, schema, options) {
  return node => {
    if (!node) {
      return node;
    }

    return app.act(_extends({}, _pins.PIN_LIST_REMOVE, { schema, criteria: { id }, options })).then(updateParent(app, node, id, schema, options))
    // Проверить остались ли у родителя дети если нет - заменить ему leaf на true
    .then(result => (0, _setParentLeafTrue2.default)(app, schema, node.parentId).then(() => result));
  };
}

function updateParent(app, node, id, schema, options) {
  return removedRows => {
    if (removedRows) {
      let params = { parentId: node.parentId };
      return app.act(_extends({}, _pins.PIN_LIST_UPDATE, { schema, criteria: { parentId: id }, params, options }));
    }

    return removedRows;
  };
}
//# sourceMappingURL=remove-node.js.map