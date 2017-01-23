'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _microjs = require('@microjs/microjs');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _pins = require('./pins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let client = _ref.driver,
      connection = (0, _objectWithoutProperties3.default)(_ref, ['driver']);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _microjs.genid)(), schema: name => {} };
    const options = {
      client,
      connection,
      useNullAsDefault: true
    };
    const middleware = (0, _knex2.default)(options);

    app.add(_pins.PIN_OPTIONS, (_ref3) => {
      (0, _objectDestructuringEmpty3.default)(_ref3);
      return _promise2.default.resolve(options);
    });
    app.add(_pins.PIN_CONNECTION, (_ref4) => {
      (0, _objectDestructuringEmpty3.default)(_ref4);
      return _promise2.default.resolve(middleware);
    });

    (0, _modules2.default)(app, plugin, { middleware, onClose });

    onClose(handlerOnClose);
  };
};

function handlerOnClose(app) {
  app.del(_pins.PIN_CONNECTION);
  app.del(_pins.PIN_OPTIONS);
}
//# sourceMappingURL=plugin.js.map