import { Schema, SchemaTypes } from './../';

export const CONNECT_OPTIONS = {
  driver  : 'sqlite3',
  filename: ':memory:'
};

const tableName = 'module-list-db';

export const createTable = (connection) => {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer('userId');
    table.string('login');
    table.unique([ 'userId', 'login' ]);
  });
};

export const schema = new Schema('UserInfo', {
  userId: {
    type       : SchemaTypes.number,
    unique     : true,
    description: 'Идентификатор пользователя'
  },
  login: {
    type       : SchemaTypes.string,
    max        : 128,
    trim       : true,
    unique     : true,
    description: 'Уникальный логин (email) для входа'
  },
}, { tableName });