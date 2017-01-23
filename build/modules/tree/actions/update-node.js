'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildUpdateTreeNode = buildUpdateTreeNode;

var _schema = require('../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setParentLeafTrue = require('../utils/set-parent-leaf-true');

var _setParentLeafTrue2 = _interopRequireDefault(_setParentLeafTrue);

var _setParentLeafFalse = require('../utils/set-parent-leaf-false');

var _setParentLeafFalse2 = _interopRequireDefault(_setParentLeafFalse);

var _constants = require('./../constants');

var _pins = require('../../../pins');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'update-node' };

exports.default = (app, middleware, plugin) => msg => buildUpdateTreeNode(app, middleware, msg);

function buildUpdateTreeNode(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$params = _ref.params;
  let params = _ref$params === undefined ? {} : _ref$params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const id = criteria.id;
  const parentId = params.parentId;


  if (!id) {
    return _promise2.default.reject((0, _errors.propertyIsRequiredError)((0, _extends3.default)({}, ERROR_INFO, { property: 'criteria.id' })));
  }

  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  // Если не передали parentId - дальнейшая логика излишняя
  if (!parentId || !isFinite(+parentId)) {
    return app.act((0, _extends3.default)({}, _pins.PIN_LIST_UPDATE, { schema, criteria: { id }, params, options }));
  }

  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId'] }
  })).then(node => {
    if (!node) {
      return node;
    }

    return app.act((0, _extends3.default)({}, _pins.PIN_LIST_UPDATE, { schema, criteria: { id }, params, options })).then(updated => {
      // Если новый parentId не равен старому
      if (node.parentId !== +parentId) {
        return _promise2.default.all([
        // Проверить остались ли у родителя дети, если нет - заменить ему leaf на true
        (0, _setParentLeafTrue2.default)(app, schema, node.parentId),
        // Заменить текущему родителю leaf на false если это первый его ребенок
        (0, _setParentLeafFalse2.default)(app, schema, parentId)]).then(() => updated);
      }

      return updated;
    });
  }).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO));
}
//# sourceMappingURL=update-node.js.map