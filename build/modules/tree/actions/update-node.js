'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildUpdateTreeNode = buildUpdateTreeNode;

var _schema = require('../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setParentLeafTrue = require('../utils/set-parent-leaf-true');

var _setParentLeafTrue2 = _interopRequireDefault(_setParentLeafTrue);

var _setParentLeafFalse = require('../utils/set-parent-leaf-false');

var _setParentLeafFalse2 = _interopRequireDefault(_setParentLeafFalse);

var _constants = require('./../constants');

var _constants2 = require('./../../constants');

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
    return Promise.reject((0, _errors.propertyIsRequiredError)(_extends({}, ERROR_INFO, { property: 'criteria.id' })));
  }

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  // Если не передали parentId - дальнейшая логика излишняя
  if (!parentId || !isFinite(+parentId)) {
    return app.act(_extends({}, _constants2.PIN_LIST_UPDATE, { schema, criteria: { id }, params, options }));
  }

  return app.act(_extends({}, _constants2.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId'] }
  })).then(node => {
    if (!node) {
      return node;
    }

    return app.act(_extends({}, _constants2.PIN_LIST_UPDATE, { schema, criteria: { id }, params, options })).then(updated => {
      // Если новый parentId не равен старому
      if (node.parentId !== +parentId) {
        return Promise.all([
        // Проверить остались ли у родителя дети, если нет - заменить ему leaf на true
        (0, _setParentLeafTrue2.default)(app, schema, node.parentId),
        // Заменить текущему родителю leaf на false если это первый его ребенок
        (0, _setParentLeafFalse2.default)(app, schema, parentId)]).then(() => updated);
      }

      return updated;
    });
  }).catch((0, _errors.internalError)(app, ERROR_INFO));
}
//# sourceMappingURL=update-node.js.map