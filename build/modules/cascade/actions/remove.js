'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = cascadeRemove;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


  return new _promise2.default((() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (resolve, reject) {
      const meta = { request: request.request, required, propertyName, originalName, criteria };
      let name = originalName + '.' + propertyName;
      let result;

      try {
        if (removePin) {
          request.log.trace(`Каскадное удаление "${name}"`, meta);
          result = yield request.act((0, _extends3.default)({}, removePin, { criteria }));
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