'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PIN_TREE_REMOVE = exports.PIN_TREE_UPDATE = exports.PIN_TREE_CREATE = exports.PIN_TREE_FIND_PATH = exports.PIN_LIST_REMOVE = exports.PIN_LIST_UPDATE = exports.PIN_LIST_CREATE = exports.PIN_LIST_COUNTS = exports.PIN_LIST_FIND_LIST = exports.PIN_LIST_FIND_ONE = exports.PIN_TREE = exports.PIN_LIST = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./../constants');

const PIN_LIST = exports.PIN_LIST = _extends({}, _constants.PIN_PLUGIN, { module: 'dal-actions-list', schema: '*' });
const PIN_TREE = exports.PIN_TREE = _extends({}, _constants.PIN_PLUGIN, { module: 'dal-actions-tree', schema: '*' });

const PIN_LIST_FIND_ONE = exports.PIN_LIST_FIND_ONE = _extends({}, PIN_LIST, { action: 'find-one', criteria: '*' });
const PIN_LIST_FIND_LIST = exports.PIN_LIST_FIND_LIST = _extends({}, PIN_LIST, { action: 'find-list' });
const PIN_LIST_COUNTS = exports.PIN_LIST_COUNTS = _extends({}, PIN_LIST, { action: 'count', criteria: '*' });
const PIN_LIST_CREATE = exports.PIN_LIST_CREATE = _extends({}, PIN_LIST, { action: 'create', params: '*' });
const PIN_LIST_UPDATE = exports.PIN_LIST_UPDATE = _extends({}, PIN_LIST, { action: 'update', criteria: '*', params: '*' });
const PIN_LIST_REMOVE = exports.PIN_LIST_REMOVE = _extends({}, PIN_LIST, { action: 'remove', criteria: '*' });

const PIN_TREE_FIND_PATH = exports.PIN_TREE_FIND_PATH = _extends({}, PIN_TREE, { action: 'find-path', criteria: '*' });
const PIN_TREE_CREATE = exports.PIN_TREE_CREATE = _extends({}, PIN_TREE, { action: 'create', params: '*' });
const PIN_TREE_UPDATE = exports.PIN_TREE_UPDATE = _extends({}, PIN_TREE, { action: 'update', criteria: '*', params: '*' });
const PIN_TREE_REMOVE = exports.PIN_TREE_REMOVE = _extends({}, PIN_TREE, { action: 'remove', criteria: '*' });
//# sourceMappingURL=constants.js.map