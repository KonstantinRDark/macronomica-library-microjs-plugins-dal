'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _boolean = require('./types/boolean');

var _boolean2 = _interopRequireDefault(_boolean);

var _number = require('./types/number');

var _number2 = _interopRequireDefault(_number);

var _smallint = require('./types/smallint');

var _smallint2 = _interopRequireDefault(_smallint);

var _integer = require('./types/integer');

var _integer2 = _interopRequireDefault(_integer);

var _float = require('./types/float');

var _float2 = _interopRequireDefault(_float);

var _money = require('./types/money');

var _money2 = _interopRequireDefault(_money);

var _string = require('./types/string');

var _string2 = _interopRequireDefault(_string);

var _text = require('./types/text');

var _text2 = _interopRequireDefault(_text);

var _datetime = require('./types/datetime');

var _datetime2 = _interopRequireDefault(_datetime);

var _array = require('./types/array');

var _array2 = _interopRequireDefault(_array);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get boolean() {
    return _boolean2.default;
  },
  get number() {
    return _number2.default;
  },
  get smallint() {
    return _smallint2.default;
  },
  get integer() {
    return _integer2.default;
  },
  get float() {
    return _float2.default;
  },
  get money() {
    return _money2.default;
  },
  get string() {
    return _string2.default;
  },
  get text() {
    return _text2.default;
  },
  get datetime() {
    return _datetime2.default;
  },
  get array() {
    return _array2.default;
  }
};
//# sourceMappingURL=index.js.map