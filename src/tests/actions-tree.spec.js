import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_TREE_CREATE,
  PIN_TREE_UPDATE,
  PIN_TREE_FIND_PATH,
  PIN_TREE_REMOVE
} from '../index';

const should = chai.should();
const micro = Micro({
  level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS) ]
});
const tableName = 'module-list-db';

const schema = new Schema('UserInfo', {
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

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
);
after(() => micro.end());

describe('actions-tree', function() {
  let model;

  it('#ping', () => micro
    .act('cmd:ping')
    .then(result => should.equal(result, 'pong'))
  );

});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer('userId');
    table.string('login');
    table.unique([ 'userId', 'login' ]);
  });
}

function findFull(id) {
  return micro
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'userId', 'login' ] }
    });
}