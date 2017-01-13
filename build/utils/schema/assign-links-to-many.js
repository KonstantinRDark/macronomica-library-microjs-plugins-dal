'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _schemaTypes = require('./../schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = schema => (records, exec) => {
  const properties = schema.properties;
  const links = schema.__assignLinksMany;

  if (!links.keys.length) {
    return Promise.resolve(records);
  }

  const criteria = records.reduce((result, record) => {

    for (let propertyName of links.keys) {
      let property = properties[propertyName];
      let hasMany = property.type === _schemaTypes2.default.array;
      let value = _dotObject2.default.pick(propertyName, record);

      if (value === undefined || hasMany && Array.isArray(value) && !value.length) {
        continue;
      }

      let data = result[propertyName] = result[propertyName] || {
        list: [],
        map: hasMany ? new WeakMap() : new Map()
      };

      if (!data.map.has(value)) {
        data.list.push(value);
        data.map.set(value, []);
      }

      data.map.get(value).push(record);
    }

    return result;
  }, {});

  // Получаем все связанные объекты и сетим их себе
  return Promise.all(Object.keys(criteria).map(propertyName => {
    let name = !!~propertyName.lastIndexOf('.') ? propertyName.slice(0, propertyName.lastIndexOf('.')) : propertyName;
    let hasMany = properties[propertyName].type === _schemaTypes2.default.array;
    let list = criteria[propertyName].list;
    let map = criteria[propertyName].map;

    if (!list.length) {
      return Promise.resolve();
    }

    const pin = links[propertyName];

    return hasMany ? Promise.all(list.map(loadOne)) : loadOne(list);

    function loadOne(list) {
      return exec(_extends({}, pin, { criteria: { id: { in: list } } })).then(recordsLinks => recordsLinks.map(link => map.get(hasMany ? list : link.id).map(record => {
        if (hasMany) {
          let innerList = _dotObject2.default.pick(name, record);
          innerList.forEach((id, i) => {
            if (link.id === id) {
              innerList[i] = link;
            }
          });
        } else {
          Object.assign(_dotObject2.default.pick(name, record), link);
        }

        return record;
      })));
    }
  })).then(() => records);
};
//# sourceMappingURL=assign-links-to-many.js.map