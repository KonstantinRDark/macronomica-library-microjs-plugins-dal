export const ERROR_SEPARATOR = ':';
export const ERROR_PREFIX = 'error.plugin-dal';

export const ERROR_INTERNAL_ERROR = 'internal.error';
export const ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

export const ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;
export const ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;
export const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;



const PREFIX_LIST = `${ ERROR_PREFIX }/list`;

export const ERROR_LIST_FIND_ONE_INTERNAL_ERROR =
  `${ PREFIX_LIST }/find-one/internal.error`;

export const ERROR_LIST_FIND_LIST_INTERNAL_ERROR =
  `${ PREFIX_LIST }/find-list/internal.error`;

export const ERROR_LIST_COUNT_INTERNAL_ERROR =
  `${ PREFIX_LIST }/count/internal.error`;

export const ERROR_LIST_CREATE_INTERNAL_ERROR =
  `${ PREFIX_LIST }/create/internal.error`;

export const ERROR_LIST_UPDATE_INTERNAL_ERROR =
  `${ PREFIX_LIST }/update/internal.error`;

export const ERROR_LIST_REMOVE_INTERNAL_ERROR =
  `${ PREFIX_LIST }/remove/internal.error`;

const PREFIX_TREE = `${ ERROR_PREFIX }/tree/`;

export const ERROR_TREE_UPDATE_ID_PROPERTY_IS_REQUIRED = `${ ERROR_PREFIX }/tree-update-node/`+
  'id.property.is.required';
