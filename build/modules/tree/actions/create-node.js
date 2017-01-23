'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildCreateTreeNode = buildCreateTreeNode;

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _pins = require('../../../pins');

var _setParentLeafFalse = require('../utils/set-parent-leaf-false');

var _setParentLeafFalse2 = _interopRequireDefault(_setParentLeafFalse);

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'create-node' };

exports.default = (app, middleware, plugin) => msg => buildCreateTreeNode(app, middleware, msg);

function buildCreateTreeNode(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$params = _ref.params;
  let params = _ref$params === undefined ? {} : _ref$params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  var _params$parentId = params.parentId;
  const parentId = _params$parentId === undefined ? null : _params$parentId;


  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_CREATE, { schema, params: (0, _extends3.default)({}, params, { parentId }), options })).then(node => (0, _setParentLeafFalse2.default)(app, schema, parentId).then(() => node)).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO));
}
//# sourceMappingURL=create-node.js.map