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
    return Promise.resolve(record);
  }

  // Получаем все связанные объекты и сетим их себе
  return Promise.all(promises).then(() => record);

  function __assignLink(propertyName, hasMany, pin) {
    const name = !!~propertyName.lastIndexOf('.') ? propertyName.slice(0, propertyName.lastIndexOf('.')) : propertyName;
    const criteria = {};
    const value = _dotObject2.default.pick(propertyName, record);

    if (value === undefined || hasMany && Array.isArray(value) && !value.length) {
      return Promise.resolve(record);
    }

    if (hasMany) {
      criteria.id = { in: value };
    } else {
      criteria.id = value;
    }

    return exec(_extends({}, pin, { criteria })).then(link => {
      if (hasMany) {
        record[name] = link;
      } else {
        Object.assign(record[name], link);
      }

      return record;
    });
  }
};
//# sourceMappingURL=assign-links-to-one.js.map