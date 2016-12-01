'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./../constants');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_ref) => {
  let module = _ref.module,
      action = _ref.action;

  return (0, _error2.default)({ message: _constants.ERROR_SCHEMA_NOT_INSTANCE_SCHEMA_CLASS, module, action });
};
//# sourceMappingURL=schema-not-instance-schema-class.js.map