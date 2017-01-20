import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS, CONNECT_OPTIONS_PG } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_CASCADE_SAVE_MANY,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_REMOVE
} from '../index';

const should = chai.should();
const micro = Micro({
  level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS_PG) ]
});

const schema = new Schema('CascadeDependent', {
  'number': {
    type: SchemaTypes.number
  }
}, {
  tableName: 'module_cascade_many_dependent_db'
});

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
);
after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('actions-cascade-many', function() {
  const CASCADE_SAVE_MANY = {
    ...PIN_CASCADE_SAVE_MANY,
    required    : false,
    originalName: 'owner',
    propertyName: 'preview',
    pins        : {
      remove: { ...PIN_LIST_REMOVE, schema },
      create: { ...PIN_LIST_CREATE, schema },
      update: { ...PIN_LIST_UPDATE, schema }
    }
  };

  it('#save-many (create - 2)', () => micro
    .act({ ...CASCADE_SAVE_MANY,
      params: [ { number: 1 }, { number: 2 } ]
    })
    .then(() => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(2),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('number').be.a('number').equal(1),
      result[ 1 ].should.be.a('object'),
      result[ 1 ].should.have.property('number').be.a('number').equal(2),
    ]))
  );

  it('#save-many (create - 1, update - 1, remove - 1)', () => micro
    .act({ ...CASCADE_SAVE_MANY,
      original: [ { id: 1, number: 1 }, { id: 2, number: 2 } ],
      params  : [ { id: 2, number: 3 }, { number: 4 } ]
    })
    .then(() => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      result.should.be.a('array').with.length(2),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('number').be.a('number').equal(3),
      result[ 1 ].should.be.a('object'),
      result[ 1 ].should.have.property('number').be.a('number').equal(4),
    ]))
  );

  it('#save-many (remove - 2)', () => micro
    .act({ ...CASCADE_SAVE_MANY,
      original: [ { id: 2, number: 3 }, { id: 3, number: 4 } ],
      params  : null
    })
    .then(() => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      result.should.be.a('array').with.length(0)
    ]))
  );

});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(schema.tableName, function (table) {
    table.increments();
    table.integer(schema.properties[ 'number' ].dbName);
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(schema.tableName);
}
