'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = setParentLeafTrue;

var _pins = require('../../../pins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setParentLeafTrue(app, schema, parentId) {
  if (!parentId) {
    return _promise2.default.resolve();
  }

  return app.act((0, _extends3.default)({}, _pins.PIN_LIST_COUNTS, { schema, criteria: { parentId } })).then((_ref) => {
    let count = _ref.count;

    const params = { leaf: true };
    const criteria = { id: parentId, leaf: false };
    return count === 0 ? app.act((0, _extends3.default)({}, _pins.PIN_LIST_UPDATE, { schema, criteria, params })) : _promise2.default.resolve();
  });
}
//# sourceMappingURL=set-parent-leaf-true.js.map