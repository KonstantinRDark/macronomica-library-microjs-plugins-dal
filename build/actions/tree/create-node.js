'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildCreateTreeNode = buildCreateTreeNode;

var _create = require('./../create');

var _setParentLeafFalse = require('./utils/set-parent-leaf-false');

var _setParentLeafFalse2 = _interopRequireDefault(_setParentLeafFalse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, params, options) {
    return buildCreateTreeNode(middleware, schema, params, options);
  };
};

function buildCreateTreeNode(middleware, schema) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _params$parentId = params.parentId,
      parentId = _params$parentId === undefined ? null : _params$parentId;


  return (0, _create.buildCreate)(middleware, schema, _extends({}, params, { parentId: parentId }), options).then(function (node) {
    return (0, _setParentLeafFalse2.default)(middleware, schema, parentId).then(function () {
      return node;
    });
  });
}
//# sourceMappingURL=create-node.js.map