'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  let info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return err => (0, _microjs.internalErrorPromise)(app, (0, _extends3.default)({ plugin: _constants.PLUGIN_SHORT_NAME }, info))(err);
};
//# sourceMappingURL=internal-error-promise.js.map