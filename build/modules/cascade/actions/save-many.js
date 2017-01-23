'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = cascadeSaveMany;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _pins = require('../../../pins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


  return new _promise2.default((() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (resolve, reject) {
      const meta = { request: request.request, required, propertyName, originalName, params };
      let name = originalName + '.' + propertyName;
      let result = [];
      // Сгруппируем по ID
      let groupedById = original.reduce(function (map, item) {
        return (0, _assign2.default)(map, { [item.id]: item });
      }, {});

      // Сохраним
      if (Array.isArray(params) && !!params.length) {
        try {
          yield _promise2.default.all(params.map(function (params) {
            // Если прилша картинка для обновления и она присутвует в оригинальной галереи - удалим ее из группы
            if (!!params.id && params.id in groupedById) {
              delete groupedById[params.id];
            }

            let promise;

            if (updatePin && 'id' in params) {
              request.log.info(`Каскадное обновление "${name}"`, meta);
              let id = params.id,
                  other = (0, _objectWithoutProperties3.default)(params, ['id']);

              promise = request.act((0, _extends3.default)({}, updatePin, { params: other, criteria: { id } }));
            } else if (createPin) {
              request.log.info(`Каскадное создание "${name}"`, meta);
              promise = request.act((0, _extends3.default)({}, createPin, { params }));
            } else if (savePin) {
              request.log.info(`Каскадное сохранение "${name}"`, meta);
              promise = request.act((0, _extends3.default)({}, savePin, { params }));
            } else {
              request.log[required ? 'warn' : 'info'](`Не передан пин для каскадного (создания && обновления) || сохранения свойства "${name}"`, meta);

              return _promise2.default.resolve();
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

      let removeKeys = (0, _keys2.default)(groupedById);

      // Если передали null или есть оригинал и его id не соответсвует переданной записи
      if (params === null && original.length || removeKeys.length) {
        try {
          yield request.act((0, _extends3.default)({}, _pins.PIN_CASCADE_REMOVE, {
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