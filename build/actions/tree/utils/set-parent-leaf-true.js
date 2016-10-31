'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setParentLeafTrue;

var _count = require('./../../count');

var _update = require('./../../update');

function setParentLeafTrue(middleware, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return (0, _count.buildCount)(middleware, schema, { parentId: parentId }).then(function (_ref) {
    var count = _ref.count;

    return count === 0 ? (0, _update.buildUpdate)(middleware, schema, { id: parentId, leaf: false }, { leaf: true }) : Promise.resolve();
  });
}
//# sourceMappingURL=set-parent-leaf-true.js.map