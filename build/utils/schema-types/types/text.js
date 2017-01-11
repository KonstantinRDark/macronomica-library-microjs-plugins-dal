'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isstring');

var _lodash4 = _interopRequireDefault(_lodash3);

var _htmlEntities = require('html-entities');

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _applyValidators = require('../utils/apply-validators');

var _applyValidators2 = _interopRequireDefault(_applyValidators);

var _setDefault = require('../utils/validators/set-default');

var _setDefault2 = _interopRequireDefault(_setDefault);

var _setMinMax = require('../utils/validators/set-min-max');

var _setMinMax2 = _interopRequireDefault(_setMinMax);

var _setRequired = require('../utils/validators/set-required');

var _setRequired2 = _interopRequireDefault(_setRequired);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Можно посмотреть на: https://github.com/punkave/sanitize-html

const entities = new _htmlEntities.XmlEntities();

exports.default = {
  value: 'text',
  convertIn,
  convertOut,
  schema: (0, _lodash2.default)(schemaValidate)
};


function schemaValidate() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.create(null);

  let schema = _joi2.default.string();

  return (0, _applyValidators2.default)(options, schema, [(0, _setMinMax2.default)(), _setDefault2.default, _setRequired2.default]);
}

function convertIn(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$format = _ref.format;

  let format = _ref$format === undefined ? 'text' : _ref$format,
      other = _objectWithoutProperties(_ref, ['format']);

  if (!(0, _lodash4.default)(value)) {
    return value;
  }

  switch (format) {
    case 'text':
      return (0, _striptags2.default)(value);
    case 'html':
      return entities.encode(value);
    default:
      return value;
  }
}

function convertOut(value) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$format = _ref2.format;

  let format = _ref2$format === undefined ? 'text' : _ref2$format,
      other = _objectWithoutProperties(_ref2, ['format']);

  if (!(0, _lodash4.default)(value)) {
    return value;
  }

  switch (format) {
    case 'html':
      return entities.decode(value);
    default:
      return value;
  }
}
//# sourceMappingURL=text.js.map