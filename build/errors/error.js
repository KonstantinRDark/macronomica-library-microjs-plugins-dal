'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./../constants');

exports.default = (_ref) => {
  var _ref$module = _ref.module;
  let module = _ref$module === undefined ? '-' : _ref$module;
  var _ref$action = _ref.action;
  let action = _ref$action === undefined ? '-' : _ref$action;
  var _ref$message = _ref.message;
  let message = _ref$message === undefined ? '-' : _ref$message;

  return new Error([_constants.ERROR_PREFIX, module, action, message].join(_constants.ERROR_SEPARATOR));
};
//# sourceMappingURL=error.js.map