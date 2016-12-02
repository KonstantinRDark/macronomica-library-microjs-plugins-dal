'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _microjs = require('@microjs/microjs');

var _microjs2 = _interopRequireDefault(_microjs);

var _constants = require('./constants');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS)]
});
const tableName = 'module-list-db';

const schema = new _index.Schema('UserInfo', {
  userId: {
    type: _index.SchemaTypes.number,
    unique: true,
    description: 'Идентификатор пользователя'
  },
  login: {
    type: _index.SchemaTypes.string,
    max: 128,
    trim: true,
    unique: true,
    description: 'Уникальный логин (email) для входа'
  }
}, { tableName });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable));
after(() => micro.end());

describe('actions-tree', function () {
  let model;

  it('#ping', () => micro.act('cmd:ping').then(result => should.equal(result, 'pong')));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer('userId');
    table.string('login');
    table.unique(['userId', 'login']);
  });
}

function findFull(id) {
  return micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'userId', 'login'] }
  }));
}
//# sourceMappingURL=actions-tree.spec.js.map