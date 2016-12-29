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

const tableName = 'module_list_dot_db';
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
  }
}, { tableName });

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
);
after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('dot-properties', function() {
  let model;

  it('#ping', () => micro
    .act('cmd:ping')
    .then(result => should.equal(result, 'pong'))
  );

  it('#create return { id }', () => micro
    .act({ ...PIN_LIST_CREATE, schema, params: {
      dot       : { property: 1, property1: 1, property2: 2 },
      customProp: true,
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

  it('#find-one return { id, dot: { property1, property2 } }', () => findFull(model.id)
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('id').be.a('number').equal(model.id),
      result.should.have.property('dot')
        .property('property1').be.a('number').equal(model.dot.property1),
      result.should.have.property('dot')
        .property('property2').be.a('number').equal(model.dot.property2)
    ]))
  );

  it('#update update property "dot.property1"', () => micro
    .act({
      ...PIN_LIST_UPDATE,
      schema,
      criteria: { id: model.id },
      params  : { dot: { property1: 2 } },
    })
    .then(() => findFull(model.id))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('object'),
      result.should.have.property('dot')
        .property('property1').not.equal(model.dot.property1),
      result.should.have.property('dot')
        .property('property1').equal(2),
    ]).then(() => model = result))
  );

});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer(schema.properties[ 'dot.property1' ].dbName);
    table.integer(schema.properties[ 'dot.property2' ].dbName);
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