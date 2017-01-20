import DalPlugin from './plugin';
import Schema from './utils/schema';
import SchemaTypes from './utils/schema-types';
import isRange from './utils/is-range';
import {
  schemaNotFoundError,
  internalErrorPromise,
  propertyIsRequiredError,
  detectedSqlInjectionError,
  schemaNotInstanceSchemaClassError
} from './errors';

import {
  PIN_OPTIONS, PIN_CONNECTION,

  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_COUNTS,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_REMOVE,

  PIN_TREE_FIND_PARENT_id,
  PIN_TREE_FIND_PATH,
  PIN_TREE_CREATE,
  PIN_TREE_UPDATE,
  PIN_TREE_REMOVE,

  PIN_CASCADE_SAVE_ONE,
  PIN_CASCADE_SAVE_MANY,
  PIN_CASCADE_REMOVE
} from './pins';

const Types = SchemaTypes;

export default DalPlugin;
export {
  Schema,
  Types,
  SchemaTypes,
  isRange,

  PIN_OPTIONS, PIN_CONNECTION,

  PIN_LIST_FIND_ONE,
  PIN_LIST_FIND_LIST,
  PIN_LIST_COUNTS,
  PIN_LIST_CREATE,
  PIN_LIST_UPDATE,
  PIN_LIST_REMOVE,

  PIN_TREE_FIND_PARENT_id,
  PIN_TREE_FIND_PATH,
  PIN_TREE_CREATE,
  PIN_TREE_UPDATE,
  PIN_TREE_REMOVE,

  PIN_CASCADE_SAVE_ONE,
  PIN_CASCADE_SAVE_MANY,
  PIN_CASCADE_REMOVE,
  
  schemaNotFoundError,
  internalErrorPromise,
  propertyIsRequiredError,
  detectedSqlInjectionError,
  schemaNotInstanceSchemaClassError
}