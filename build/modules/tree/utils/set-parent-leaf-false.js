'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = setParentLeafFalse;

var _pins = require('../../../pins');

function setParentLeafFalse(app, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  const params = { leaf: false };
  const criteria = { id: parentId, leaf: true };

  return app.act(_extends({}, _pins.PIN_LIST_UPDATE, { schema, criteria, params }));
}
//# sourceMappingURL=set-parent-leaf-false.js.map