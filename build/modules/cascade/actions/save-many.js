'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = cascadeSaveMany;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _pins = require('../../../pins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CascadeSaveInternalError = (0, _wrapped2.default)({
  message: ['{name} - Ошибка каскадного сохранения "{propertyName}"', '{name} - {origMessage}'].join(_os2.default.EOL),
  type: 'micro.plugins.dal.cascade.save.many.internal',
  propertyName: null
});

function cascadeSaveMany(request) {
  var _request$originalName = request.originalName;
  const originalName = _request$originalName === undefined ? 'not.indicated' : _request$originalName;
  var _request$propertyName = request.propertyName;
  const propertyName = _request$propertyName === undefined ? 'not.indicated' : _request$propertyName;
  var _request$required = request.required;
  const required = _request$required === undefined ? false : _request$required;
  var _request$original = request.original;
  const original = _request$original === undefined ? [] : _request$original;
  var _request$params = request.params;
  const params = _request$params === undefined ? [] : _request$params;
  var _request$pins = request.pins;
  const pins = _request$pins === undefined ? {} : _request$pins;
  var _request$errors = request.errors;
  const errors = _request$errors === undefined ? {} : _request$errors;
  const savePin = pins.save,
        createPin = pins.create,
        updatePin = pins.update;
  const SaveError = errors.save;
  var _errors$create = errors.create;
  const CreateError = _errors$create === undefined ? SaveError : _errors$create;
  var _errors$update = errors.update;
  const UpdateError = _errors$update === undefined ? SaveError : _errors$update;


  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      const meta = { request: request.request, required, propertyName, originalName, params };
      let name = originalName + '.' + propertyName;
      let result = [];
      // Сгруппируем по ID
      let groupedById = original.reduce(function (map, item) {
        return Object.assign(map, { [item.id]: item });
      }, {});

      // Сохраним
      if (Array.isArray(params) && !!params.length) {
        try {
          yield Promise.all(params.map(function (params) {
            // Если прилша картинка для обновления и она присутвует в оригинальной галереи - удалим ее из группы
            if (!!params.id && params.id in groupedById) {
              delete groupedById[params.id];
            }

            let promise;

            if (updatePin && 'id' in params) {
              request.log.info(`Каскадное обновление "${name}"`, meta);

              let id = params.id,
                  other = _objectWithoutProperties(params, ['id']);

              promise = request.act(_extends({}, updatePin, { params: other, criteria: { id } }));
            } else if (createPin) {
              request.log.info(`Каскадное создание "${name}"`, meta);
              promise = request.act(_extends({}, createPin, { params }));
            } else if (savePin) {
              request.log.info(`Каскадное сохранение "${name}"`, meta);
              promise = request.act(_extends({}, savePin, { params }));
            } else {
              request.log[required ? 'warn' : 'info'](`Не передан пин для каскадного (создания && обновления) || сохранения свойства "${name}"`, meta);

              return Promise.resolve();
            }

            return promise.then(function (item) {
              return result.push(item);
            });
          }));
        } catch (e) {
          let error;

          if (UpdateError) {
            error = UpdateError(e, meta);
          } else if (CreateError) {
            error = CreateError(e, meta);
          } else if (SaveError) {
            error = SaveError(e, meta);
          } else {
            error = CascadeSaveInternalError(e, meta);
          }

          request.log.error(error, meta);

          if (required) {
            return reject(error);
          }
        }
      }

      let removeKeys = Object.keys(groupedById);

      // Если передали null или есть оригинал и его id не соответсвует переданной записи
      if (params === null && original.length || removeKeys.length) {
        try {
          yield request.act(_extends({}, _pins.PIN_CASCADE_REMOVE, {
            originalName,
            propertyName,
            required,
            criteria: { id: { in: params === null ? original.map(function (_ref2) {
                  let id = _ref2.id;
                  return id;
                }) : removeKeys } },
            pins,
            errors
          }));
        } catch (e) {
          if (required) {
            return reject(e);
          }
        }
      }

      resolve(result);
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=save-many.js.map