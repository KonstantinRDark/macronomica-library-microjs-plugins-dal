'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  let info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return err => {
    app.log.error(err, info);
    return Promise.reject((0, _error2.default)(_extends({ message: _error.ERROR_INTERNAL_ERROR }, info)));
  };
};
//# sourceMappingURL=internal-error.js.map