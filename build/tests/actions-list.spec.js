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

const tableName = 'module_list_db';
const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS_PG)]
});

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
after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('actions-list', function () {
  let model;

  it('#ping', () => micro.act('cmd:ping').then(result => should.equal(result, 'pong')));

  it('#create return { id }', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema, params: {
      userId: 1,
      customProp: true,
      login: 'test'
    } })).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id'), result.id.should.be.a('number')]).then(() => result)).then(result => findFull(result.id).then(result => model = result)));

  it('#create return [{ id }, { id }]', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema, params: [{ userId: 111, login: 'test111' }, { userId: 2222, login: 'test2222' }] })).then(result => _promise2.default.all([should.exist(result), result.should.be.a('array').with.length(2)]).then(() => result).then(result => micro.act((0, _extends3.default)({}, _index.PIN_LIST_REMOVE, { schema,
    criteria: {
      id: { in: result.map(model => model.id) }
    }
  })))));

  it('#find-one return { id, userId, login }', () => findFull(model.id).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id), result.should.have.property('userId').be.a('number').equal(model.userId), result.should.have.property('login').be.a('string').equal(model.login)])));

  it('#find-one return { id }', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, { schema, criteria: { id: model.id } })).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id), result.should.not.have.property('userId'), result.should.not.have.property('login')])));

  it('#find-list return [{ id }]', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema })).then(result => _promise2.default.all([should.exist(result), result.should.be.a('array').with.length(1), result[0].should.be.a('object'), result[0].should.have.property('id').be.a('number').equal(model.id), result[0].should.not.have.property('userId'), result[0].should.not.have.property('login')])));

  it('#update one property login', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_UPDATE, {
    schema,
    criteria: { id: model.id },
    params: { login: 'login2' }
  })).then(() => findFull(model.id)).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').equal(model.id), result.should.have.property('login').not.equal(model.login), result.should.have.property('login').equal('login2'), result.should.have.property('userId').equal(model.userId)]).then(() => model = result)));

  it('#update property login, userId', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_UPDATE, {
    schema,
    criteria: { id: model.id },
    params: { login: 'login3', userId: 2 }
  })).then(() => findFull(model.id)).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').equal(model.id), result.should.have.property('login').not.equal(model.login), result.should.have.property('login').equal('login3'), result.should.have.property('userId').not.equal(model.userId), result.should.have.property('userId').equal(2)]).then(() => model = result)));

  it('#remove return { id }', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_REMOVE, { schema, criteria: { id: model.id } })).then(result => _promise2.default.all([should.exist(result[0]), result[0].should.be.a('object'), result[0].should.have.property('id').be.a('number').equal(model.id)])));

  it('#find-one should return null', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, { schema, criteria: { id: model.id } })).then(result => should.not.exist(result)));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(schema.tableName, function (table) {
    table.increments();
    table.integer(schema.properties['userId'].dbName);
    table.string(schema.properties['login'].dbName);
    table.unique([schema.properties['userId'].dbName, schema.properties['login'].dbName]);
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(schema.tableName);
}

function findFull(id) {
  return micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: 'full' }
  }));
}
//# sourceMappingURL=actions-list.spec.js.map