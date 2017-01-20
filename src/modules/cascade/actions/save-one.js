import os from 'os';
import WrappedError from 'error/wrapped';
import { PIN_CASCADE_REMOVE } from '../../../pins';

const CascadeSaveInternalError = WrappedError({
  message: [
    '{name} - Ошибка каскадного сохранения "{propertyName}"',
    '{name} - {origMessage}',
  ].join(os.EOL),
  type        : 'micro.plugins.dal.cascade.save.one.internal',
  propertyName: null
});

export default function cascadeSaveOne(request) {
  const {
    originalName = 'not.indicated',
    propertyName = 'not.indicated',
    required = false,
    original = {},
    params,
    pins = {},
    errors = {}
  } = request;
  const {
    save:savePin,
    create:createPin,
    update:updatePin
  } = pins;
  const {
    save:SaveError,
    create:CreateError = SaveError,
    update:UpdateError = SaveError
  } = errors;

  return new Promise(async (resolve, reject) => {
    const meta = { request: request.request, required, propertyName, originalName, params };
    let name = originalName + '.' + propertyName;
    let result;

    // Сохраним
    if (!!params) {
      try {

        if (updatePin && 'id' in params) {
          request.log.info(`Каскадное обновление "${ name }"`, meta);
          let { id, ...other } = params;
          result = await request.act({ ...updatePin, params: other, criteria: { id } });
        }
        else if (createPin) {
          request.log.info(`Каскадное создание "${ name }"`, meta);
          result = await request.act({ ...createPin, params });
        }
        else if (savePin) {
          request.log.info(`Каскадное сохранение "${ name }"`, meta);
          result = await request.act({ ...savePin, params });
        }
        else {
          request.log[ required ? 'warn' : 'info' ](
            `Не передан пин для каскадного (создания && обновления) || сохранения свойства "${ name }"`,
            meta
          );
        }
      }
      catch (e) {
        let error;

        if (UpdateError) { error = UpdateError(e, meta) }
        else if (CreateError) { error = CreateError(e, meta) }
        else if (SaveError) { error = SaveError(e, meta) }
        else { error = CascadeSaveInternalError(e, meta) }

        request.log.error(error, meta);

        if (required) {
          return reject(error);
        }
      }
    }

    // Если передали null или есть оригинал и его id не соответсвует переданной записи
    if (
      (params === null && 'id' in original)
      || ('id' in original && !!params && original.id !== params.id)
    ) {
      try {
        result = await request.act({
          ...PIN_CASCADE_REMOVE,
          originalName,
          propertyName,
          required,
          criteria: { id: original.id },
          pins,
          errors
        });
      }
      catch (e) {
        if (required) {
          return reject(e);
        }
      }
    }

    resolve(result);
  });
};