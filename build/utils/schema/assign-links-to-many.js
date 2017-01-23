'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _schemaTypes = require('./../schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = schema => (records, exec) => {
  const properties = schema.properties;
  const links = schema.__assignLinksMany;

  if (!links.keys.length) {
    return _promise2.default.resolve(records);
  }

  const criteria = records.reduce((result, record) => {

    for (let propertyName of links.keys) {
      let property = properties[propertyName];
      let hasMany = property.type === _schemaTypes2.default.array;
      let value = _dotObject2.default.pick(propertyName, record);

      if (value === undefined || value === null || hasMany && Array.isArray(value) && !value.length) {
        continue;
      }

      let data = result[propertyName] = result[propertyName] || {
        list: [],
        map: hasMany ? new _weakMap2.default() : new _map2.default()
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
  return _promise2.default.all((0, _keys2.default)(criteria).map(propertyName => {
    let name = !!~propertyName.lastIndexOf('.') ? propertyName.slice(0, propertyName.lastIndexOf('.')) : propertyName;
    let hasMany = properties[propertyName].type === _schemaTypes2.default.array;
    let list = criteria[propertyName].list;
    let map = criteria[propertyName].map;

    if (!list.length) {
      return _promise2.default.resolve();
    }

    const pin = links[propertyName];

    return hasMany ? _promise2.default.all(list.map(loadOne)) : loadOne(list);

    function loadOne(list) {
      return exec((0, _extends3.default)({}, pin, { criteria: { id: { in: list } } })).then(recordsLinks => recordsLinks.map(link => map.get(hasMany ? list : link.id).map(record => {
        if (hasMany) {
          let innerList = _dotObject2.default.pick(name, record);
          innerList.forEach((id, i) => {
            if (link.id === id) {
              innerList[i] = link;
            }
          });
        } else {
          (0, _assign2.default)(_dotObject2.default.pick(name, record), link);
        }

        return record;
      })));
    }
  })).then(() => records);
};
//# sourceMappingURL=assign-links-to-many.js.map