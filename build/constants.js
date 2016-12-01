'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERROR_SEPARATOR = exports.ERROR_SEPARATOR = ':';
const ERROR_PREFIX = exports.ERROR_PREFIX = 'error.plugin-dal';

const ERROR_INTERNAL_ERROR = exports.ERROR_INTERNAL_ERROR = 'internal.error';
const ERROR_PROPERTY_IS_REQUIRED = exports.ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

const ERROR_DETECTED_SQL_INJECTION = exports.ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;
const ERROR_SCHEMA_NOT_FOUND = exports.ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;
const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = exports.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;

const PREFIX_LIST = `${ ERROR_PREFIX }/list`;

const ERROR_LIST_FIND_ONE_INTERNAL_ERROR = exports.ERROR_LIST_FIND_ONE_INTERNAL_ERROR = `${ PREFIX_LIST }/find-one/internal.error`;

const ERROR_LIST_FIND_LIST_INTERNAL_ERROR = exports.ERROR_LIST_FIND_LIST_INTERNAL_ERROR = `${ PREFIX_LIST }/find-list/internal.error`;

const ERROR_LIST_COUNT_INTERNAL_ERROR = exports.ERROR_LIST_COUNT_INTERNAL_ERROR = `${ PREFIX_LIST }/count/internal.error`;

const ERROR_LIST_CREATE_INTERNAL_ERROR = exports.ERROR_LIST_CREATE_INTERNAL_ERROR = `${ PREFIX_LIST }/create/internal.error`;

const ERROR_LIST_UPDATE_INTERNAL_ERROR = exports.ERROR_LIST_UPDATE_INTERNAL_ERROR = `${ PREFIX_LIST }/update/internal.error`;

const ERROR_LIST_REMOVE_INTERNAL_ERROR = exports.ERROR_LIST_REMOVE_INTERNAL_ERROR = `${ PREFIX_LIST }/remove/internal.error`;

const PREFIX_TREE = `${ ERROR_PREFIX }/tree/`;

const ERROR_TREE_UPDATE_ID_PROPERTY_IS_REQUIRED = exports.ERROR_TREE_UPDATE_ID_PROPERTY_IS_REQUIRED = `${ ERROR_PREFIX }/tree-update-node/` + 'id.property.is.required';
//# sourceMappingURL=constants.js.map