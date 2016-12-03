'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _microjs = require('@microjs/microjs');

var _constants = require('./../constants');

exports.default = function (app) {
  let info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return err => {
    const e = (0, _microjs.internalError)(_extends({ plugin: _constants.PLUGIN_SHORT_NAME }, info));
    app.log.error(e.message, err);
    return Promise.reject(e);
  };
};
//# sourceMappingURL=internal-error-promise.js.map