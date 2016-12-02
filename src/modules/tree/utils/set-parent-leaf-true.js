import { PIN_LIST_COUNTS, PIN_LIST_UPDATE } from '../../../pins';

export default function setParentLeafTrue (app, schema, parentId) {
  if (!parentId) {
    return Promise.resolve();
  }

  return app.act({ ...PIN_LIST_COUNTS, schema, criteria: { parentId } })
    .then(({ count }) => {
      const params = { leaf: true };
      const criteria = { id: parentId, leaf: false };
      return count === 0
        ? app.act({ ...PIN_LIST_UPDATE, schema, criteria, params })
        : Promise.resolve();
    });
}