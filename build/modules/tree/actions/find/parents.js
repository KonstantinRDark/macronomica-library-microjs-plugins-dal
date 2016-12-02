'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildFindParentsTreeNodes = buildFindParentsTreeNodes;

var _schema = require('./../../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _pins = require('../../../../pins');

var _constants = require('./../../constants');

var _errors = require('../../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'find-parents' };

exports.default = (app, middleware, plugin) => msg => buildFindParentsTreeNodes(app, middleware, msg);

function buildFindParentsTreeNodes(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  let parentId = criteria.parentId;


  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  if (!parentId || parentId === '' || parentId.toLowerCase() === 'null') {
    parentId = null;
  }

  // Загружаем себя
  return app.act(_extends({}, _pins.PIN_LIST_FIND_LIST, {
    schema,
    options,
    criteria: { parentId }
  })).catch((0, _errors.internalError)(app, ERROR_INFO));
}
//# sourceMappingURL=parents.js.map