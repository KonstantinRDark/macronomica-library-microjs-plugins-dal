import os from 'os';
import WrappedError from 'error/wrapped';

const CascadeRemoveInternalError = WrappedError({
  message: [
    '{name} - Ошибка каскадного удаления "{propertyName}"',
    '{name} - {origMessage}',
  ].join(os.EOL),
  type        : 'micro.plugins.dal.cascade.remove.internal',
  propertyName: null
});

export default function cascadeRemove(request) {
  const {
    originalName = 'not.indicated',
    propertyName = 'not.indicated',
    required = false,
    criteria,
    pins = {},
    errors = {}
  } = request;
  const { remove:removePin } = pins;
  const { remove:RemoveError } = errors;

  return new Promise(async (resolve, reject) => {
    const meta = { request: request.request, required, propertyName, originalName, criteria };
    let name = originalName + '.' + propertyName;
    let result;

    try {
      if (removePin) {
        request.log.trace(`Каскадное удаление "${ name }"`, meta);
        result = await request.act({ ...removePin, criteria });
      }
      else {
        request.log[ required ? 'warn' : 'info' ](
          `Не передан пин для каскадного удаления свойства "${ name }"`,
          meta
        );
      }
    }
    catch (e) {
      let error;

      if (RemoveError) {
        error = RemoveError(e, meta);
      } else {
        error = CascadeRemoveInternalError(e, meta);
      }

      request.log.error(error, meta);

      if (required) {
        return reject(error);
      }
    }

    resolve(result);
  });
};