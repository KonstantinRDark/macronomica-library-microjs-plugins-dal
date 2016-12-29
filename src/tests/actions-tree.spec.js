import chai from 'chai';
import Micro, { LEVEL_ERROR } from '@microjs/microjs';
import { CONNECT_OPTIONS } from './constants';
import Plugin, {
  Schema,
  SchemaTypes,
  PIN_CONNECTION,
  PIN_LIST_FIND_ONE,
  PIN_TREE_FIND_PARENT_id,
  PIN_TREE_CREATE,
  PIN_TREE_UPDATE,
  PIN_TREE_FIND_PATH,
  PIN_TREE_REMOVE
} from '../index';

const should = chai.should();
const micro = Micro({
  level  : LEVEL_ERROR,
  plugins: [ Plugin(CONNECT_OPTIONS) ]
});
const tableName = 'module-tree-db';

const schema = new Schema('TreeNode', {
  parentId: {
    type: SchemaTypes.number,
    null: true
  },
  leaf: {
    type   : SchemaTypes.boolean,
    default: true
  },
  name: {
    type: SchemaTypes.string,
    max : 128,
    trim: true
  },
}, { tableName });

before(() => micro
  .run()
  .then(() => micro.act(PIN_CONNECTION))
  .then(createTable)
);
after(() => micro.act(PIN_CONNECTION)
  .then(dropTable)
  .then(() => micro.end()));

describe('actions-tree', function() {

  it('ping', () => micro
    .act('cmd:ping')
    .then(result => should.equal(result, 'pong'))
  );

  it('create', () => {
    let root;
    let child;

    return createNode({ name: 'node-root' })
      .then(result => Promise.all([
        root = result,
        should.exist(result),
        result.should.be.a('object'),
        result.should.have.property('id'),
        result.id.should.be.a('number')
      ]))
      .then(() => findOne(root.id))
      .then(result => Promise.all([
        should.exist(result),
        result.should.have.property('leaf').be.a('boolean').equal(true)
      ]))

      .then(() => createNode({ parentId: root.id, name: 'node-child-1' }))
      .then(result => Promise.all([
        child = result,
        should.exist(result),
        result.should.be.a('object'),
        result.should.have.property('id'),
        result.id.should.be.a('number')
      ]).then(() => result))

      .then(result => Promise.all([ findOne(root.id), findOne(result.id) ]))
      .then(([ root, child ]) => Promise
        .all([
          should.exist(root),
          should.exist(child),
          root.should.have.property('leaf').be.a('boolean').equal(false),
          child.should.have.property('leaf').be.a('boolean').equal(true)
      ]))
      .then(() => Promise.all([ removeNode(root.id), removeNode(child.id) ]));
  });

  it('update', () => {
    let roots;
    let child;

    return Promise
      .all([
        createNode({ name: 'node-root-1' }),
        createNode({ name: 'node-root-2' }),
      ])
      .then(result => roots = result)
      .then(roots => createNode({ parentId: roots[ 0 ].id, name: 'node-child-1' })
        .then(child => updateNode(child.id, { parentId: roots[ 1 ].id })
          .then(() => Promise
            .all([
              findOne(roots[ 0 ].id),
              findOne(roots[ 1 ].id),
              findOne(child.id)
            ])
            .then(([ root1, root2, child ]) => Promise.all([
              should.exist(root1),
              should.exist(root2),
              should.exist(child),
              root1.should.have.property('leaf').equal(true),
              root2.should.have.property('leaf').equal(false),
              child.should.have.property('leaf').equal(true),
              child.should.have.property('parentId').not.equal(root1.id),
              child.should.have.property('parentId').equal(root2.id),
            ]))
          )
          .then(result => Promise.all([
            removeNode(roots[ 0 ].id),
            removeNode(roots[ 1 ].id),
            removeNode(child.id)
          ]))
        )
      );
  });

  it('find path', () => createNode({ name: 'node-root-1' })
    .then(root => createNode({ parentId: root.id, name: 'node-child-1' })
      .then(child1 => createNode({ parentId: child1.id, name: 'node-child-2' })
        .then(child2 => Promise
          .all([
            findPath(),
            findPath(child1.id),
            findPath(child2.id),
          ])
          .then(([ rootPath, child1Path, child2Path ]) => Promise
            .all([
              rootPath.should.with.length(0),
              child1Path.should.with.length(1),
              child2Path.should.with.length(2)
            ])
            .then(() => Promise.all([
              removeNode(root.id),
              removeNode(child1.id),
              removeNode(child2.id)
            ]))
          )
        )
      )
    )
  );

  it('find parents', () => createNode({ name: 'node-root-1' })
    .then(root => createNode({ parentId: root.id, name: 'node-child-1' })
      .then(child1 => createNode({ parentId: root.id, name: 'node-child-1' })
        .then(child2 => Promise
          .all([
            findByParentId(),
            findByParentId(root.id),
            findByParentId(child1.id),
            findByParentId(child2.id),
          ])
          .then(([ list1, list2, list3, list4 ]) => Promise
            .all([
              list1.should.with.length(1),
              list2.should.with.length(2),
              list3.should.with.length(0),
              list4.should.with.length(0)
            ])
            .then(() => Promise.all([
              removeNode(root.id),
              removeNode(child1.id),
              removeNode(child2.id)
            ]))
          )
        )
      )
    )
  );

  it('remove', () => createNode({ name: 'node-root-1' })
    .then(root => removeNode(root.id))
  );
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(schema.tableName, function (table) {
    table.increments();
    table.integer('parentId').nullable();
    table.boolean('leaf').defaultTo(schema.properties.leaf.default);
    table.string('name');
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(schema.tableName);
}

function removeNode(id) {
  return micro
    .act({
      ...PIN_TREE_REMOVE,
      schema,
      criteria: { id }
    });
}

function updateNode(id, params) {
  return micro
    .act({
      ...PIN_TREE_UPDATE,
      schema,
      criteria: { id },
      params
    });
}

function createNode(params = {}) {
  return micro
    .act({
      ...PIN_TREE_CREATE,
      schema,
      params
    });
}

function findPath(id) {
  return micro
    .act({
      ...PIN_TREE_FIND_PATH,
      schema,
      criteria: { id }
    });
}

function findByParentId(parentId) {
  return micro
    .act({
      ...PIN_TREE_FIND_PARENT_id,
      schema,
      criteria: { parentId }
    });
}

function findOne(id, fields = [ 'id', 'parentId', 'leaf', 'name' ]) {
  return micro
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields }
    });
}

function findFull(id) {
  return micro
    .act({
      ...PIN_LIST_FIND_ONE,
      schema,
      criteria: { id },
      options : { fields: [ 'id', 'parentId', 'leaf', 'name' ] }
    });
}