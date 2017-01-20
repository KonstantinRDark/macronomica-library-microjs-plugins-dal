'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = cascadeRemove;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CascadeRemoveInternalError = (0, _wrapped2.default)({
  message: ['{name} - Ошибка каскадного удаления "{propertyName}"', '{name} - {origMessage}'].join(_os2.default.EOL),
  type: 'micro.plugins.dal.cascade.remove.internal',
  propertyName: null
});

function cascadeRemove(request) {
  var _request$originalName = request.originalName;
  const originalName = _request$originalName === undefined ? 'not.indicated' : _request$originalName;
  var _request$propertyName = request.propertyName;
  const propertyName = _request$propertyName === undefined ? 'not.indicated' : _request$propertyName;
  var _request$required = request.required;
  const required = _request$required === undefined ? false : _request$required,
        criteria = request.criteria;
  var _request$pins = request.pins;
  const pins = _request$pins === undefined ? {} : _request$pins;
  var _request$errors = request.errors;
  const errors = _request$errors === undefined ? {} : _request$errors;
  const removePin = pins.remove;
  const RemoveError = errors.remove;


  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      const meta = { request: request.request, required, propertyName, originalName, criteria };
      let name = originalName + '.' + propertyName;
      let result;

      try {
        if (removePin) {
          request.log.trace(`Каскадное удаление "${name}"`, meta);
          result = yield request.act(_extends({}, removePin, { criteria }));
        } else {
          request.log[required ? 'warn' : 'info'](`Не передан пин для каскадного удаления свойства "${name}"`, meta);
        }
      } catch (e) {
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

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=remove.js.map