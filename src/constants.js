export const PIN_PLUGIN = { role: 'plugin' };
export const PIN_OPTIONS = { ...PIN_PLUGIN, cmd: 'options' };
export const PIN_CONNECTION = { ...PIN_PLUGIN, cmd: 'connection' };

export const ERROR_SEPARATOR = ':';
export const ERROR_PREFIX = 'error.plugin-dal';

export const ERROR_INTERNAL_ERROR = 'internal.error';
export const ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

export const ERROR_DETECTED_SQL_INJECTION = `detected.sql.injection`;
export const ERROR_SCHEMA_NOT_FOUND = `schema.not.found`;
export const ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS = `schema.not.instance.schemaclass`;