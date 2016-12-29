'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelName = 'test';
const tableName = 'memory';
const should = _chai2.default.should();

describe('schema', function () {

  it('#create success', () => {
    const schema = new _index.Schema(modelName, {
      userId: {
        type: _index.SchemaTypes.number
      },
      login: {
        type: _index.SchemaTypes.string
      }
    }, { tableName });
    schema.should.be.instanceof(_index.Schema).equal(schema);
  });

  it('#all properties correct added in fieldsMask', () => {
    const mask = ['link', 'edit'];
    const full = ['prop1', 'prop2', 'prop3'];

    const schema = new _index.Schema(modelName, {
      ['prop0']: {
        type: _index.SchemaTypes.number,
        fieldsMask: false // только прямой запрос
      },
      ['prop1']: {
        type: _index.SchemaTypes.number,
        fieldsMask: 'edit:!link' // будет в full, edit
      },
      'prop2': {
        type: _index.SchemaTypes.string,
        fieldsMask: ['!edit'] },
      'prop3': {
        type: _index.SchemaTypes.string,
        fieldsMask: { full: false } }
    }, { tableName, fieldsMask: mask });
    console.log(schema.__masks);

    return Promise.all([schema.getMyFields().should.eql(['id']).with.length(1), schema.getMyFields(['id', 'prop0']).should.eql(['id', 'prop0']).with.length(2), schema.getMyFields('full').should.eql(['id', 'prop1', 'prop2']).with.length(3), schema.getMyFields('link').should.eql(['id', 'prop2', 'prop3']).with.length(3), schema.getMyFields('edit').should.eql(['id', 'prop1', 'prop3']).with.length(3)]);
  });
});
//# sourceMappingURL=schema.spec.js.map