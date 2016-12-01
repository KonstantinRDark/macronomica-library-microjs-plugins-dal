'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.createTable = exports.CONNECT_OPTIONS = undefined;

var _ = require('./../');

const CONNECT_OPTIONS = exports.CONNECT_OPTIONS = {
  driver: 'sqlite3',
  filename: ':memory:'
};

const tableName = 'module-list-db';

const createTable = exports.createTable = connection => {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer('userId');
    table.string('login');
    table.unique(['userId', 'login']);
  });
};

const schema = exports.schema = new _.Schema('UserInfo', {
  userId: {
    type: _.SchemaTypes.number,
    unique: true,
    description: 'Идентификатор пользователя'
  },
  login: {
    type: _.SchemaTypes.string,
    max: 128,
    trim: true,
    unique: true,
    description: 'Уникальный логин (email) для входа'
  }
}, { tableName });
//# sourceMappingURL=constants.js.map