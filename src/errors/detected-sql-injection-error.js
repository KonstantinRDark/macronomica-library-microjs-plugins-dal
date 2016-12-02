import error, { ERROR_DETECTED_SQL_INJECTION } from './error';

export default (app, { property, value, ...info }) => {
  app.log.error(ERROR_DETECTED_SQL_INJECTION, { property, value, ...info });
  return error({ message: ERROR_DETECTED_SQL_INJECTION, ...info });
};