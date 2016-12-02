import error, { ERROR_INTERNAL_ERROR } from './error';

export default (app, info = {}) => {
  return (err) => {
    app.log.error(err, info);
    return Promise.reject(error({ message: ERROR_INTERNAL_ERROR, ...info }));
  };
};