import chai from 'chai';
import Plugin, { Schema, SchemaTypes } from '../index';

const modelName = 'test';
const tableName = 'memory';
const should = chai.should();

describe('schema', function() {

  it('#create success', () => {
    const schema = new Schema(modelName, {
      userId: {
        type: SchemaTypes.number,
      },
      login: {
        type: SchemaTypes.string,
      }
    }, { tableName });
    schema.should.be.instanceof(Schema).equal(schema);
  });

  it('#all properties correct added in fieldsMask', () => {
    const mask = [ 'link', 'edit' ];
    const full = [ 'prop1', 'prop2', 'prop3' ];

    const schema = new Schema(modelName, {
      [ 'prop0' ]: {
        type      : SchemaTypes.number,
        fieldsMask: false          // только прямой запрос
      },
      [ 'prop1' ]: {
        type      : SchemaTypes.number,
        fieldsMask: 'edit:!link'          // будет в full, edit
      },
      'prop2': {
        type      : SchemaTypes.string,
        fieldsMask: [ '!edit' ],           // будет в full, link
      },
      'prop3': {
        type      : SchemaTypes.string,
        fieldsMask: { full: false },      // будет в link, edit
      }
    }, { tableName, fieldsMask: mask });

    return Promise.all([
      schema.getMyFields().should.eql([ 'id' ]).with.length(1),
      schema.getMyFields([ 'id', 'prop0' ]).should.eql([ 'id', 'prop0' ]).with.length(2),
      schema.getMyFields('full').should.eql([ 'id', 'prop1', 'prop2' ]).with.length(3),
      schema.getMyFields('link').should.eql([ 'id', 'prop2', 'prop3' ]).with.length(3),
      schema.getMyFields('edit').should.eql([ 'id', 'prop1', 'prop3' ]).with.length(3)
    ]);
  });

});