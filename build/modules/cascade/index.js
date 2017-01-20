'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pins = require('./../../pins');

var pins = _interopRequireWildcard(_pins);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (app, plugin, _ref) => {
  let middleware = _ref.middleware,
      onClose = _ref.onClose;

  app.add(pins.PIN_CASCADE_SAVE_ONE, require('./actions/save-one').default);
  app.add(pins.PIN_CASCADE_SAVE_MANY, require('./actions/save-many').default);
  app.add(pins.PIN_CASCADE_REMOVE, require('./actions/remove').default);
};
//# sourceMappingURL=index.js.map