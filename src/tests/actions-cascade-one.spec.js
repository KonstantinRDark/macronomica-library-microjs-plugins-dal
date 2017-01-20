import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS, CONNECT_OPTIONS_PG } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_CASCADE_SAVE_ONE,
  PIN_CASCADE_SAVE_MANY,
  PIN_CASCADE_REMOVE,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_REMOVE
} from '../index';

const should = chai.should();
const micro = Micro({
  // level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS_PG) ]
});

const schema = new Schema('CascadeDependent', {
  'number': {
    type: SchemaTypes.number
  }
}, {
  tableName: 'module_cascade_one_dependent_db'
});

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
);
after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('actions-cascade-one', function() {
  const CASCADE_SAVE_ONE = {
    ...PIN_CASCADE_SAVE_ONE,
    required    : false,
    originalName: 'owner',
    propertyName: 'preview',
    pins        : {
      remove: { ...PIN_LIST_REMOVE, schema },
      create: { ...PIN_LIST_CREATE, schema },
      update: { ...PIN_LIST_UPDATE, schema }
    }
  };

  it('#save-one (create)', () => micro
    .act({ ...CASCADE_SAVE_ONE,
      params: { number: 1 }
    })
    .then(({ id }) => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(1),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('number').be.a('number').equal(1),
    ]))
  );

  it('#save-one (update)', () => micro
    .act({ ...CASCADE_SAVE_ONE,
      original: { id: 1, number: 1 },
      params  : { id: 1, number: 2 }
    })
    .then(({ id }) => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(1),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('number').be.a('number').equal(2),
    ]))
  );

  it('#save-one (not save / not remove)', () => micro
    .act({ ...CASCADE_SAVE_ONE,
      original: { id: 1, number: 2 },
      params  : undefined
    })
    .then(() => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(1),
      result[ 0 ].should.be.a('object'),
      result[ 0 ].should.have.property('number').be.a('number').equal(2),
    ]))
  );

  it('#save-one (remove)', () => micro
    .act({ ...CASCADE_SAVE_ONE,
      original: { id: 1, number: 2 },
      params  : null
    })
    .then(({ id }) => micro.act({ ...PIN_LIST_FIND_LIST, schema, options: { fields: 'full' } }))
    .then(result => Promise.all([
      should.exist(result),
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
