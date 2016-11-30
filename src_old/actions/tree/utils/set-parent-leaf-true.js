import {buildCount} from './../../count';
import {buildUpdate} from './../../update';

export default function setParentLeafTrue (middleware, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return buildCount(middleware, schema, { parentId })
    .then(({ count }) => {
      return count === 0
        ? buildUpdate(middleware, schema, { id: parentId, leaf: false }, { leaf: true })
        : Promise.resolve();
    });
}