'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _microjs = require('@microjs/microjs');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let client = _ref.driver,
      connection = _objectWithoutProperties(_ref, ['driver']);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _microjs.genid)(), schema: name => {} };
    const options = {
      client,
      connection,
      useNullAsDefault: true
    };
    const middleware = (0, _knex2.default)(options);

    app.add(_constants.PIN_OPTIONS, (_ref3) => {
      _objectDestructuringEmpty(_ref3);

      return Promise.resolve(options);
    });
    app.add(_constants.PIN_CONNECTION, (_ref4) => {
      _objectDestructuringEmpty(_ref4);

      return Promise.resolve(middleware);
    });

    (0, _modules2.default)(app, plugin, { middleware, onClose });

    onClose(handlerOnClose);
  };
};

function handlerOnClose(app) {
  app.del(_constants.PIN_CONNECTION);
  app.del(_constants.PIN_OPTIONS);
}
//# sourceMappingURL=plugin.js.map