'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

const tableName = 'module_links_db';
const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS_PG)]
});

const imageSchema = new _index.Schema('Image', {
  src: { type: _index.SchemaTypes.string, required: true },
  alt: { type: _index.SchemaTypes.string, null: true }
}, { tableName: 'module_links_images' });

const ICONS_LINK = {
  one: (0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, { schema: imageSchema, options: { fields: 'full' } }),
  // Вызывается при загрузке множества User
  list: (0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema: imageSchema, options: { fields: 'full' } })
};

const userSchema = new _index.Schema('User', {
  login: { type: _index.SchemaTypes.string, required: true },
  'icon1.id': {
    type: _index.SchemaTypes.number,
    null: true,
    link: (0, _extends3.default)({}, ICONS_LINK)
  },
  'icon2.id': {
    type: _index.SchemaTypes.number,
    null: true,
    link: (0, _extends3.default)({}, ICONS_LINK)
  },
  icons: {
    type: _index.SchemaTypes.array,
    null: true,
    link: (0, _extends3.default)({}, ICONS_LINK)
  }
}, { tableName: 'module_links_users' });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable).then(() => micro.act((0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema: imageSchema, params: [{ src: 'http://example.ru/image1.png', alt: 'описание 1' }, { src: 'http://example.ru/image2.png', alt: 'описание 2' }, { src: 'http://example.ru/image3.png', alt: 'описание 3' }, { src: 'http://example.ru/image4.png', alt: 'описание 4' }] })).then((_ref) => {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 4);

  let img1 = _ref2[0],
      img2 = _ref2[1],
      img3 = _ref2[2],
      img4 = _ref2[3];
  return micro.act((0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema: userSchema, params: [{ login: 'user1', icon1: { id: img1.id }, icon2: { id: img2.id }, icons: [img1.id, img2.id] }, { login: 'user2', icon1: { id: img3.id }, icon2: { id: img4.id }, icons: [img3.id, img4.id] }] }));
})));

after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('schema', function () {

  it('#one-link', () => _promise2.default.all([micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema: userSchema,
    options: { fields: 'full' },
    criteria: { id: 1 }
  })), micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema: userSchema,
    options: { fields: 'full' },
    criteria: { id: 2 }
  }))]).then(validate));

  it('#list-link', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_LIST, { schema: userSchema, options: { fields: 'full' } })).then(validate));

  function validate() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
        _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

    let user1 = _ref4[0],
        user2 = _ref4[1];

    return _promise2.default.all([...checkOne(user1, {
      id: 1,
      login: 'user1',
      icon1: { id: 1, src: 'http://example.ru/image1.png', alt: 'описание 1' },
      icon2: { id: 2, src: 'http://example.ru/image2.png', alt: 'описание 2' }
    }), ...checkOne(user2, {
      id: 2,
      login: 'user2',
      icon1: { id: 3, src: 'http://example.ru/image3.png', alt: 'описание 3' },
      icon2: { id: 4, src: 'http://example.ru/image4.png', alt: 'описание 4' }
    })]);
  }

  function checkOne(user, equal) {
    return [user.should.be.a('object'), user.should.have.property('id').be.a('number').equal(equal.id), user.should.have.property('login').be.a('string').equal(equal.login), ...checkIcons(user.icons, equal), ...checkIcon(user.icon1, equal.icon1), ...checkIcon(user.icon2, equal.icon2)];
  }

  function checkIcon(icon, equal) {
    return [icon.should.be.a('object'), icon.should.have.property('id').be.a('number').equal(equal.id), icon.should.have.property('src').be.a('string').equal(equal.src), icon.should.have.property('alt').be.a('string').equal(equal.alt)];
  }

  function checkIcons(icons, equal) {
    return [icons.should.be.a('array').length(2), ...checkIcon(icons[0], equal.icon1), ...checkIcon(icons[1], equal.icon2)];
  }
});

function createTable(connection) {
  return _promise2.default.all([connection.schema.createTableIfNotExists(imageSchema.tableName, function (table) {
    table.increments();
    table.string(imageSchema.properties['src'].dbName);
    table.string(imageSchema.properties['alt'].dbName);
  }), connection.schema.createTableIfNotExists(userSchema.tableName, function (table) {
    table.increments();
    table.string(userSchema.properties['login'].dbName);
    table.integer(userSchema.properties['icon1.id'].dbName);
    table.integer(userSchema.properties['icon2.id'].dbName);
    table.string(userSchema.properties['icons'].dbName);
  })]);
}

function dropTable(connection) {
  return _promise2.default.all([connection.schema.dropTableIfExists(imageSchema.tableName), connection.schema.dropTableIfExists(userSchema.tableName)]);
}
//# sourceMappingURL=links.spec.js.map