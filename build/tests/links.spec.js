'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

const userSchema = new _index.Schema('User', {
  login: { type: _index.SchemaTypes.string, required: true },
  'icon1.id': {
    type: _index.SchemaTypes.number,
    null: true,
    link: {
      one: _extends({}, _index.PIN_LIST_FIND_ONE, { schema: imageSchema, options: { fields: 'full' } }),
      // Вызывается при загрузке множества User
      list: _extends({}, _index.PIN_LIST_FIND_LIST, { schema: imageSchema, options: { fields: 'full' } })
    }
  },
  'icon2.id': {
    type: _index.SchemaTypes.number,
    null: true,
    link: {
      one: _extends({}, _index.PIN_LIST_FIND_ONE, { schema: imageSchema, options: { fields: 'full' } }),
      // Вызывается при загрузке множества User
      list: _extends({}, _index.PIN_LIST_FIND_LIST, { schema: imageSchema, options: { fields: 'full' } })
    }
  }
}, { tableName: 'module_links_users' });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable).then(() => micro.act(_extends({}, _index.PIN_LIST_CREATE, { schema: imageSchema, params: [{ src: 'http://example.ru/image1.png', alt: 'описание 1' }, { src: 'http://example.ru/image2.png', alt: 'описание 2' }, { src: 'http://example.ru/image3.png', alt: 'описание 3' }, { src: 'http://example.ru/image4.png', alt: 'описание 4' }] })).then((_ref) => {
  var _ref2 = _slicedToArray(_ref, 4);

  let img1 = _ref2[0],
      img2 = _ref2[1],
      img3 = _ref2[2],
      img4 = _ref2[3];
  return micro.act(_extends({}, _index.PIN_LIST_CREATE, { schema: userSchema, params: [{ login: 'user1', icon1: { id: img1.id }, icon2: { id: img2.id } }, { login: 'user2', icon1: { id: img3.id }, icon2: { id: img4.id } }] }));
})));

after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('schema', function () {

  it('#one link', () => Promise.all([micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, {
    schema: userSchema,
    options: { fields: 'full' },
    criteria: { id: 1 }
  })), micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, {
    schema: userSchema,
    options: { fields: 'full' },
    criteria: { id: 2 }
  }))]).then(validate));

  it('#list link', () => micro.act(_extends({}, _index.PIN_LIST_FIND_LIST, { schema: userSchema, options: { fields: 'full' } })).then(validate));

  function validate() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
        _ref4 = _slicedToArray(_ref3, 2);

    let user1 = _ref4[0],
        user2 = _ref4[1];

    return Promise.all([...checkOne(user1, {
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
    return [user.should.be.a('object'), user.should.have.property('id').be.a('number').equal(equal.id), user.should.have.property('login').be.a('string').equal(equal.login), ...checkIcon(user.icon1, equal.icon1), ...checkIcon(user.icon2, equal.icon2)];
  }

  function checkIcon(icon, equal) {
    return [icon.should.be.a('object'), icon.should.have.property('id').be.a('number').equal(equal.id), icon.should.have.property('src').be.a('string').equal(equal.src), icon.should.have.property('alt').be.a('string').equal(equal.alt)];
  }
});

function createTable(connection) {
  return Promise.all([connection.schema.createTableIfNotExists(imageSchema.tableName, function (table) {
    table.increments();
    table.string(imageSchema.properties['src'].dbName);
    table.string(imageSchema.properties['alt'].dbName);
  }), connection.schema.createTableIfNotExists(userSchema.tableName, function (table) {
    table.increments();
    table.string(userSchema.properties['login'].dbName);
    table.integer(userSchema.properties['icon1.id'].dbName);
    table.integer(userSchema.properties['icon2.id'].dbName);
  })]);
}

function dropTable(connection) {
  return Promise.all([connection.schema.dropTableIfExists(imageSchema.tableName), connection.schema.dropTableIfExists(userSchema.tableName)]);
}
//# sourceMappingURL=links.spec.js.map