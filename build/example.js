'use strict';

var _index = require('./index');

const imageSchema = new _index.Schema('Image', {
  src: {
    type: _index.SchemaTypes.string,
    required: true
  },
  alt: {
    type: _index.SchemaTypes.string,
    null: true
  }
}, { tableName: 'images' });

const userSchema = new _index.Schema('User', {
  login: {
    type: _index.SchemaTypes.string,
    required: true
  },
  'icon.id': {
    type: _index.SchemaTypes.number,
    link: {
      one: { api: 'images', cmd: 'one', criteria: { id: 1 } },
      // Вызывается при загрузке множества User
      list: { api: 'images', cmd: 'list', criteria: { id: { in: [1] } } }
    },
    null: true
  }
}, { tableName: 'images' });
//# sourceMappingURL=example.js.map