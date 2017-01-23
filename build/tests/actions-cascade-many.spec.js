'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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
  const CASCADE_SAVE_MANY = (0, _extends3.default)({}, _index.PIN_CASCADE_SAVE_MANY, {
    required: false,
    originalName: 'owner',
    propertyName: 'preview',
    pins: {
      remove: (0, _extends3.default)({}, _index.PIN_LIST_REMOVE, { schema }),
      create: (0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema }),
      update: (0, _extends3.default)({}, _index.PIN_LIST_UPDATE, { schema })
    }
  });

  it('#save-many (create - 2)', () => micro.act((0, _extends3.default)({}, CASCADE_SAVE_MANY, {
    params: [{ number: 1 }, { number: 2 }]
  })).then(() => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => _promise2.default.all([should.exist(result), result.should.be.a('array').with.length(2), result[0].should.be.a('object'), result[0].should.have.property('number').be.a('number').equal(1), result[1].should.be.a('object'), result[1].should.have.property('number').be.a('number').equal(2)])));

  it('#save-many (create - 1, update - 1, remove - 1)', () => micro.act((0, _extends3.default)({}, CASCADE_SAVE_MANY, {
    original: [{ id: 1, number: 1 }, { id: 2, number: 2 }],
    params: [{ id: 2, number: 3 }, { number: 4 }]
  })).then(() => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => _promise2.default.all([result.should.be.a('array').with.length(2), result[0].should.be.a('object'), result[0].should.have.property('number').be.a('number').equal(3), result[1].should.be.a('object'), result[1].should.have.property('number').be.a('number').equal(4)])));

  it('#save-many (remove - 2)', () => micro.act((0, _extends3.default)({}, CASCADE_SAVE_MANY, {
    original: [{ id: 2, number: 3 }, { id: 3, number: 4 }],
    params: null
  })).then(() => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema, options: { fields: 'full' } }))).then(result => _promise2.default.all([result.should.be.a('array').with.length(0)])));
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