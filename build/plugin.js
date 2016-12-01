'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _microjs = require('@micro/microjs');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let client = _ref.driver,
      connection = _objectWithoutProperties(_ref, ['driver']);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _microjs.genid)(), schema: name => {} };
    const middleware = (0, _knex2.default)({
      client,
      connection,
      useNullAsDefault: true
    });

    (0, _methods2.default)(app, plugin, { middleware, onClose });
    (0, _modules2.default)(app, plugin, { middleware, onClose });
  };
};
//# sourceMappingURL=plugin.js.map