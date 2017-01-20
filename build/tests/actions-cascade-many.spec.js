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
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS_PG)]
});

const schema = new _index.Schema('CascadeDependent', {
  'number': {
    type: _index.SchemaTypes.number
  }
}, {
  tableName: 'module_cascade_many_dependent_db'
});

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable));
after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('actions-cascade-many', function () {
  const CASCADE_SAVE_MANY = _extends({}, _index.PIN_CASCADE_SAVE_MANY, {
    required: false,
    originalName: 'owner',
    propertyName: 'preview',
    pins: {
      remove: _extends({}, _index.PIN_LIST_REMOVE, { schema }),
      create: _extends({}, _index.PIN_LIST_CREATE, { schema }),
      update: _extends({}, _index.PIN_LIST_UPDATE, { schema })
    }
  });

  it('#save-many (create - 2)', () => micro.act(_extends({}, CASCADE_SAVE_MANY, {
    params: [{ number: 1 }, { number: 2 }]
  })).then(() => micro.act(_extends({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => Promise.all([should.exist(result), result.should.be.a('array').with.length(2), result[0].should.be.a('object'), result[0].should.have.property('number').be.a('number').equal(1), result[1].should.be.a('object'), result[1].should.have.property('number').be.a('number').equal(2)])));

  it('#save-many (create - 1, update - 1, remove - 1)', () => micro.act(_extends({}, CASCADE_SAVE_MANY, {
    original: [{ id: 1, number: 1 }, { id: 2, number: 2 }],
    params: [{ id: 2, number: 3 }, { number: 4 }]
  })).then(() => micro.act(_extends({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => Promise.all([result.should.be.a('array').with.length(2), result[0].should.be.a('object'), result[0].should.have.property('number').be.a('number').equal(3), result[1].should.be.a('object'), result[1].should.have.property('number').be.a('number').equal(4)])));

  it('#save-many (remove - 2)', () => micro.act(_extends({}, CASCADE_SAVE_MANY, {
    original: [{ id: 2, number: 3 }, { id: 3, number: 4 }],
    params: null
  })).then(() => micro.act(_extends({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => Promise.all([result.should.be.a('array').with.length(0)])));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(schema.tableName, function (table) {
    table.increments();
    table.integer(schema.properties['number'].dbName);
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(schema.tableName);
}
//# sourceMappingURL=actions-cascade-many.spec.js.map