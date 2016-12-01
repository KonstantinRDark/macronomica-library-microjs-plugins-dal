import { PIN_LIST_UPDATE } from './../../constants';

export default function setParentLeafFalse (app, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  const params = { leaf: false };
  const criteria = { id: parentId, leaf: true };

  return app.act({ ...PIN_LIST_UPDATE, schema, criteria, params });
}