import chai from 'chai';
import Plugin, { Schema, SchemaTypes } from '../index';

const modelName = 'test';
const tableName = 'memory';
const should = chai.should();

describe('schema', function() {
  
  const schema = new Schema(modelName, {
    'prop0': {
      type      : SchemaTypes.number,
      fieldsMask: false          // только прямой запрос
    },
    'prop1': {
      type      : SchemaTypes.number,
      fieldsMask: 'edit'         // будет в full, edit
    },
    'prop2': {
      type      : SchemaTypes.string,
      fieldsMask: [ 'link' ],    // будет в full, link
    },
    'prop3': {
      type      : SchemaTypes.string,
      fieldsMask: { full: false, link: true, edit: true },      // будет в link, edit
    }
  }, { tableName, fieldsMask: [ 'link', 'edit' ] });
  
  console.log(schema.__masks);
  
  it('#fields === undefined => только id', () =>
    schema.getMyFields()
      .should.eql([ 'id' ]).with.length(1));
  
  it(`fields === [ 'id', 'prop0' ] => только id, prop0`, () =>
    schema.getMyFields([ 'id', 'prop0' ])
      .should.eql([ 'id', 'prop0' ]).with.length(2));
  
  it(`fields === 'full' => только id, prop1, prop2`, () =>
    schema.getMyFields('full')
      .should.eql([ 'id', 'prop1', 'prop2' ]).with.length(3));
  
  it(`fields === 'link' => только id, prop2, prop3`, () =>
    schema.getMyFields('link')
      .should.eql([ 'id', 'prop2', 'prop3' ]).with.length(3));
  
  it(`fields === 'edit' => только id, prop1, prop3`, () =>
    schema.getMyFields('edit')
      .should.eql([ 'id', 'prop1', 'prop3' ]).with.length(3));
  
});