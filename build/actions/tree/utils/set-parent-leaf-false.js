'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setParentLeafFalse;

var _update = require('./../../update');

function setParentLeafFalse(middleware, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return (0, _update.buildUpdate)(middleware, schema, { id: parentId, leaf: true }, { leaf: false });
}
//# sourceMappingURL=set-parent-leaf-false.js.map