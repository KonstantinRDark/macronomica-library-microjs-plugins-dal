'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _schemaTypes = require('./../schema-types');

var _schemaTypes2 = _interopRequireDefault(_schemaTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = schema => (record, exec) => {
  const properties = schema.properties;
  const propertiesNames = schema.__propertiesNames;
  const promises = [];

  for (let propertyName of propertiesNames) {
    let property = properties[propertyName];
    let hasMany = property.type === _schemaTypes2.default.array;
    let name = hasMany ? 'list' : 'one';

    if (!!property.link && name in property.link) {
      promises.push(__assignLink(propertyName, hasMany, property.link[name]));
    }
  }

  if (!promises.length) {
    return _promise2.default.resolve(record);
  }

  // Получаем все связанные объекты и сетим их себе
  return _promise2.default.all(promises).then(() => record);

  function __assignLink(propertyName, hasMany, pin) {
    const name = !!~propertyName.lastIndexOf('.') ? propertyName.slice(0, propertyName.lastIndexOf('.')) : propertyName;
    const criteria = {};
    const value = _dotObject2.default.pick(propertyName, record);

    if (value === undefined || value === null || hasMany && Array.isArray(value) && !value.length) {
      return _promise2.default.resolve(record);
    }

    if (hasMany) {
      criteria.id = { in: value };
    } else {
      criteria.id = value;
    }

    return exec((0, _extends3.default)({}, pin, { criteria })).then(link => {
      if (hasMany) {
        record[name] = link;
      } else {
        (0, _assign2.default)(_dotObject2.default.pick(name, record), link);
      }

      return record;
    });
  }
};
//# sourceMappingURL=assign-links-to-one.js.map