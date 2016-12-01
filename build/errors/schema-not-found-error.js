'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./../constants');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  let info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (0, _error2.default)(_extends({ message: _constants.ERROR_SCHEMA_NOT_FOUND }, info));
};
//# sourceMappingURL=schema-not-found-error.js.map