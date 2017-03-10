'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildFindByParentIdTreeNodes = buildFindByParentIdTreeNodes;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _pins = require('../../../../pins');

var _constants = require('./../../constants');

var _errors = require('../../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'find-parent-id' };

exports.default = (app, middleware, plugin) => msg => buildFindByParentIdTreeNodes(app, middleware, msg);

function buildFindByParentIdTreeNodes(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  let parentId = criteria.parentId;


  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  if (!parentId || parentId === '' || (0, _lodash2.default)(parentId) && parentId.toLowerCase() === 'null') {
    parentId = null;
  }

  // Загружаем себя
  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_FIND_LIST, {
    schema,
    options,
    criteria: { parentId }
  })).catch(error => _promise2.default.reject((0, _errors.internalErrorPromise)(app, ERROR_INFO)(error)));
}
//# sourceMappingURL=by-parent-id.js.map