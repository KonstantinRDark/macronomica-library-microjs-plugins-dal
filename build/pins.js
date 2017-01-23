'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PIN_CASCADE_REMOVE = exports.PIN_CASCADE_SAVE_MANY = exports.PIN_CASCADE_SAVE_ONE = exports.PIN_CASCADE = exports.PIN_TREE_REMOVE = exports.PIN_TREE_UPDATE = exports.PIN_TREE_CREATE = exports.PIN_TREE_FIND_PARENT_id = exports.PIN_TREE_FIND_PATH = exports.PIN_LIST_REMOVE = exports.PIN_LIST_UPDATE = exports.PIN_LIST_CREATE = exports.PIN_LIST_COUNTS = exports.PIN_LIST_FIND_LIST = exports.PIN_LIST_FIND_ONE = exports.PIN_TREE = exports.PIN_LIST = exports.PIN_CONNECTION = exports.PIN_OPTIONS = exports.PIN_PLUGIN = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PIN_PLUGIN = exports.PIN_PLUGIN = { role: 'plugin', module: 'dal-common' };
const PIN_OPTIONS = exports.PIN_OPTIONS = (0, _extends3.default)({}, PIN_PLUGIN, { cmd: 'options' });
const PIN_CONNECTION = exports.PIN_CONNECTION = (0, _extends3.default)({}, PIN_PLUGIN, { cmd: 'connection' });

const PIN_LIST = exports.PIN_LIST = (0, _extends3.default)({}, PIN_PLUGIN, { module: 'dal-list', schema: '*' });
const PIN_TREE = exports.PIN_TREE = (0, _extends3.default)({}, PIN_PLUGIN, { module: 'dal-tree', schema: '*' });

const PIN_LIST_FIND_ONE = exports.PIN_LIST_FIND_ONE = (0, _extends3.default)({}, PIN_LIST, { action: 'find-one', criteria: '*' });
const PIN_LIST_FIND_LIST = exports.PIN_LIST_FIND_LIST = (0, _extends3.default)({}, PIN_LIST, { action: 'find-list' });
const PIN_LIST_COUNTS = exports.PIN_LIST_COUNTS = (0, _extends3.default)({}, PIN_LIST, { action: 'count', criteria: '*' });
const PIN_LIST_CREATE = exports.PIN_LIST_CREATE = (0, _extends3.default)({}, PIN_LIST, { action: 'create' });
const PIN_LIST_UPDATE = exports.PIN_LIST_UPDATE = (0, _extends3.default)({}, PIN_LIST, { action: 'update', criteria: '*', params: '*' });
const PIN_LIST_REMOVE = exports.PIN_LIST_REMOVE = (0, _extends3.default)({}, PIN_LIST, { action: 'remove', criteria: '*' });

const PIN_TREE_FIND_PATH = exports.PIN_TREE_FIND_PATH = (0, _extends3.default)({}, PIN_TREE, { action: 'find-path', criteria: '*' });
const PIN_TREE_FIND_PARENT_id = exports.PIN_TREE_FIND_PARENT_id = (0, _extends3.default)({}, PIN_TREE, { action: 'find-parent-id', criteria: '*' });
const PIN_TREE_CREATE = exports.PIN_TREE_CREATE = (0, _extends3.default)({}, PIN_TREE, { action: 'create' });
const PIN_TREE_UPDATE = exports.PIN_TREE_UPDATE = (0, _extends3.default)({}, PIN_TREE, { action: 'update', criteria: '*', params: '*' });
const PIN_TREE_REMOVE = exports.PIN_TREE_REMOVE = (0, _extends3.default)({}, PIN_TREE, { action: 'remove', criteria: '*' });

const PIN_CASCADE = exports.PIN_CASCADE = (0, _extends3.default)({}, PIN_PLUGIN, { module: 'cascade' });

const PIN_CASCADE_SAVE_ONE = exports.PIN_CASCADE_SAVE_ONE = (0, _extends3.default)({}, PIN_CASCADE, {
  cmd: 'save-one',
  originalName: '*',
  propertyName: '*',
  required: '*',
  pins: '*'
});

const PIN_CASCADE_SAVE_MANY = exports.PIN_CASCADE_SAVE_MANY = (0, _extends3.default)({}, PIN_CASCADE, {
  cmd: 'save-many',
  originalName: '*',
  propertyName: '*',
  required: '*',
  pins: '*'
});

const PIN_CASCADE_REMOVE = exports.PIN_CASCADE_REMOVE = (0, _extends3.default)({}, PIN_CASCADE, {
  cmd: 'remove',
  originalName: '*',
  propertyName: '*',
  required: '*',
  criteria: '*',
  pins: '*'
});
//# sourceMappingURL=pins.js.map