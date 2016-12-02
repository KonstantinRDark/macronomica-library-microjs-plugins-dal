'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = setParentLeafTrue;

var _pins = require('../../../pins');

function setParentLeafTrue(app, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return app.act(_extends({}, _pins.PIN_LIST_COUNTS, { schema, criteria: { parentId } })).then((_ref) => {
    let count = _ref.count;

    const params = { leaf: true };
    const criteria = { id: parentId, leaf: false };
    return count === 0 ? app.act(_extends({}, _pins.PIN_LIST_UPDATE, { schema, criteria, params })) : Promise.resolve();
  });
}
//# sourceMappingURL=set-parent-leaf-true.js.map