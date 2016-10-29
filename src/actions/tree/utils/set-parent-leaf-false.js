import {buildUpdate} from './../../update';

export default function setParentLeafFalse (middleware, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return buildUpdate(middleware, schema, { id: parentId, leaf: true }, { leaf: false });
}