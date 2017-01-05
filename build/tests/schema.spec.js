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

  const schema = new _index.Schema(modelName, {
    'prop0': {
      type: _index.SchemaTypes.number,
      fieldsMask: false // только прямой запрос
    },
    'prop1': {
      type: _index.SchemaTypes.number,
      fieldsMask: 'edit' // будет в full, edit
    },
    'prop2': {
      type: _index.SchemaTypes.string,
      fieldsMask: ['link'] },
    'prop3': {
      type: _index.SchemaTypes.string,
      fieldsMask: { full: false, link: true, edit: true } }
  }, { tableName, fieldsMask: ['link', 'edit'] });

  console.log(schema.__masks);

  it('#fields === undefined => только id', () => schema.getMyFields().should.eql(['id']).with.length(1));

  it(`fields === [ 'id', 'prop0' ] => только id, prop0`, () => schema.getMyFields(['id', 'prop0']).should.eql(['id', 'prop0']).with.length(2));

  it(`fields === 'full' => только id, prop1, prop2`, () => schema.getMyFields('full').should.eql(['id', 'prop1', 'prop2']).with.length(3));

  it(`fields === 'link' => только id, prop2, prop3`, () => schema.getMyFields('link').should.eql(['id', 'prop2', 'prop3']).with.length(3));

  it(`fields === 'edit' => только id, prop1, prop3`, () => schema.getMyFields('edit').should.eql(['id', 'prop1', 'prop3']).with.length(3));
});
//# sourceMappingURL=schema.spec.js.map