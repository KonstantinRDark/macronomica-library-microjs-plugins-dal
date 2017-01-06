import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS, CONNECT_OPTIONS_PG } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_LIST_CREATE,
  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST
} from '../index';

const tableName = 'module_links_db';
const should = chai.should();
const micro = Micro({
  level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS_PG) ]
});

const imageSchema = new Schema('Image', {
  src: { type: SchemaTypes.string, required: true },
  alt: { type: SchemaTypes.string, null: true }
}, { tableName: 'module_links_images' });

const ICONS_LINK = {
  one : { ...PIN_LIST_FIND_ONE, schema: imageSchema, options: { fields: 'full' } },
  // Вызывается при загрузке множества User
  list: { ...PIN_LIST_FIND_LIST, schema: imageSchema, options: { fields: 'full' } }
};

const userSchema = new Schema('User', {
  login     : { type: SchemaTypes.string, required: true },
  'icon1.id': {
    type: SchemaTypes.number,
    null: true,
    link: { ...ICONS_LINK }
  },
  'icon2.id': {
    type: SchemaTypes.number,
    null: true,
    link: { ...ICONS_LINK }
  },
  icons: {
    type: SchemaTypes.array,
    null: true,
    link: { ...ICONS_LINK }
  }
}, { tableName: 'module_links_users' });

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
  .then(() => micro
    .act({ ...PIN_LIST_CREATE, schema: imageSchema, params: [
      { src: 'http://example.ru/image1.png', alt: 'описание 1' },
      { src: 'http://example.ru/image2.png', alt: 'описание 2' },
      { src: 'http://example.ru/image3.png', alt: 'описание 3' },
      { src: 'http://example.ru/image4.png', alt: 'описание 4' },
    ] })
    .then(([ img1, img2, img3, img4 ]) => micro.act({ ...PIN_LIST_CREATE, schema: userSchema, params: [
      { login: 'user1', icon1: { id: img1.id }, icon2: { id: img2.id }, icons: [ img1.id, img2.id ] },
      { login: 'user2', icon1: { id: img3.id }, icon2: { id: img4.id }, icons: [ img3.id, img4.id ] },
    ] }))
  )
);

after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('schema', function() {

  it('#one-link', () => Promise.all([
      micro.act({ ...PIN_LIST_FIND_ONE,
        schema  : userSchema,
        options : { fields: 'full' },
        criteria: { id: 1 }
      }),
      micro.act({ ...PIN_LIST_FIND_ONE,
        schema  : userSchema,
        options : { fields: 'full' },
        criteria: { id: 2 }
      })
    ])
    .then(validate)
  );

  it('#list-link', () => micro
    .act({ ...PIN_LIST_FIND_LIST, schema: userSchema, options: { fields: 'full' } })
    .then(validate)
  );

  function validate([ user1, user2 ] = []) {
    return Promise.all([
      ...checkOne(user1, {
        id   : 1,
        login: 'user1',
        icon1: { id: 1, src: 'http://example.ru/image1.png', alt: 'описание 1' },
        icon2: { id: 2, src: 'http://example.ru/image2.png', alt: 'описание 2' },
      }),
      ...checkOne(user2, {
        id   : 2,
        login: 'user2',
        icon1: { id: 3, src: 'http://example.ru/image3.png', alt: 'описание 3' },
        icon2: { id: 4, src: 'http://example.ru/image4.png', alt: 'описание 4' },
      })
    ]);
  }

  function checkOne(user, equal) {
    return [
      user.should.be.a('object'),
      user.should.have.property('id').be.a('number').equal(equal.id),
      user.should.have.property('login').be.a('string').equal(equal.login),
      ...checkIcons(user.icons, equal),
      ...checkIcon(user.icon1, equal.icon1),
      ...checkIcon(user.icon2, equal.icon2)
    ];
  }

  function checkIcon(icon, equal) {
    return [
      icon.should.be.a('object'),
      icon.should.have.property('id').be.a('number').equal(equal.id),
      icon.should.have.property('src').be.a('string').equal(equal.src),
      icon.should.have.property('alt').be.a('string').equal(equal.alt),
    ];
  }

  function checkIcons(icons, equal) {
    return [
      icons.should.be.a('array').length(2),
      ...checkIcon(icons[ 0 ], equal.icon1),
      ...checkIcon(icons[ 1 ], equal.icon2)
    ];
  }
});


function createTable(connection) {
  return Promise.all([
    connection.schema.createTableIfNotExists(imageSchema.tableName, function (table) {
      table.increments();
      table.string(imageSchema.properties[ 'src' ].dbName);
      table.string(imageSchema.properties[ 'alt' ].dbName);
    }),
    connection.schema.createTableIfNotExists(userSchema.tableName, function (table) {
      table.increments();
      table.string(userSchema.properties[ 'login' ].dbName);
      table.integer(userSchema.properties[ 'icon1.id' ].dbName);
      table.integer(userSchema.properties[ 'icon2.id' ].dbName);
      table.string(userSchema.properties[ 'icons' ].dbName);
    })
  ]);
}

function dropTable(connection) {
  return Promise.all([
    connection.schema.dropTableIfExists(imageSchema.tableName),
    connection.schema.dropTableIfExists(userSchema.tableName),
  ]);
}