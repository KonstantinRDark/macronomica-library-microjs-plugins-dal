import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS, CONNECT_OPTIONS_PG } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_REMOVE
} from '../index';

const tableName = 'module_list_db';
const should = chai.should();
const micro = Micro({
  level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS_PG) ]
});

const schema = new Schema('UserInfo', {
  'dot.property1': {
    type       : SchemaTypes.number,
    description: 'Свойство записанное через точку'
  },
  'dot.property2': {
    type       : SchemaTypes.number,
    description: 'Свойство записанное через точку'
  },
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
after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('actions-list', function() {
  let model;

  it('#ping', () => micro
    .act('cmd:ping')
    .then(result => should.equal(result, 'pong'))
  );

  it('#create return { id }', () => micro
    .act({ ...PIN_LIST_CREATE, schema, params: {
      userId    : 1,
      dot       : { property: 1, property1: 1, property2: 2 },
      customProp: true,
      login     : 'test'
    } })
    .then(result => Promise
      .all([
        should.exist(result),
        result.should.be.a('object'),
        result.should.have.property('id'),
        result.id.should.be.a('number')
      ])
      .then(() => result)
    )
    .then(result => findFull(result.id).then(result => model = result))
  );

  it('#create return [{ id }, { id }]', () => micro
    .act({ ...PIN_LIST_CREATE, schema, params: [
      { userId: 111, login: 'test111' },
      { userId: 2222, login: 'test2222' }
    ] })
    .then(result => Promise
      .all([
        should.exist(result),
        result.should.be.a('array').with.length(2)
      ])
      .then(() => result)
      .then(result => micro.act({
        ...PIN_LIST_REMOVE, schema,
        criteria: {
          id: { in: result.map(model => model.id) }
        }
      }))
    )
  );

  it('#find-one return { id, dot: { property1, property2 }, userId, login }', () => findFull(model.id)
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('id').be.a('number').equal(model.id),
      result.should.have.property('dot')
        .property('property1').be.a('number').equal(model.dot.property1),
      result.should.have.property('dot')
        .property('property2').be.a('number').equal(model.dot.property2),
      result.should.have.property('userId').be.a('number').equal(model.userId),
      result.should.have.property('login').be.a('string').equal(model.login)
    ]))
  );

  it('#find-one return { id }', () => micro
    .act({ ...PIN_LIST_FIND_ONE, schema, criteria: { id: model.id } })
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('id').be.a('number').equal(model.id),
      result.should.not.have.property('userId'),
      result.should.not.have.property('login'),
    ]))
  );

  it('#find-list return [{ id }]', () => micro
    .act({ ...PIN_LIST_FIND_LIST, schema })
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(1),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('id').be.a('number').equal(model.id),
      result[ 0 ].should.not.have.property('userId'),
      result[ 0 ].should.not.have.property('login'),
    ]))
  );

  it('#update update property login', () => micro
    .act({
      ...PIN_LIST_UPDATE,
      schema,
      criteria: { id: model.id },
      params  : { login: 'login2' },
    })
    .then(() => findFull(model.id))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('id').equal(model.id),
      result.should.have.property('login').not.equal(model.login),
      result.should.have.property('login').equal('login2'),
      result.should.have.property('userId').equal(model.userId),
    ]).then(() => model = result))
  );

  it('#update update property login, userId', () => micro
    .act({
      ...PIN_LIST_UPDATE,
      schema,
      criteria: { id: model.id },
      params  : { login: 'login3', userId: 2 },
    })
    .then(() => findFull(model.id))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('id').equal(model.id),
      result.should.have.property('login').not.equal(model.login),
      result.should.have.property('login').equal('login3'),
      result.should.have.property('userId').not.equal(model.userId),
      result.should.have.property('userId').equal(2),
    ]).then(() => model = result))
  );

  it('#remove return { id }', () => micro
    .act({ ...PIN_LIST_REMOVE, schema, criteria: { id: model.id } })
    .then(result => Promise.all([
      should.exist(result[ 0 ]),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('id').be.a('number').equal(model.id)
    ]))
  );

  it('#find-one should return null', () => micro
    .act({ ...PIN_LIST_FIND_ONE, schema, criteria: { id: model.id } })
    .then(result => should.not.exist(result))
  );

});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer(schema.properties[ 'dot.property1' ].dbName);
    table.integer(schema.properties[ 'dot.property2' ].dbName);
    table.integer(schema.properties[ 'userId' ].dbName);
    table.string(schema.properties[ 'login' ].dbName);
    table.unique([
      schema.properties[ 'userId' ].dbName,
      schema.properties[ 'login' ].dbName
    ]);
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(tableName);
}

function findFull(id) {
  return micro
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: 'full' }
    });
}