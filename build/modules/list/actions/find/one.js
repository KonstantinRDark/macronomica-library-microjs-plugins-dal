'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildFindOne = buildFindOne;

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setCriteria = require('./../../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _checkLinks = require('./../../../../utils/check-links');

var _checkLinks2 = _interopRequireDefault(_checkLinks);

var _convertToResponse = require('./../../../../utils/convert-to-response');

var _convertToResponse2 = _interopRequireDefault(_convertToResponse);

var _constants = require('./../../constants');

var _errors = require('../../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'find-one' };

exports.default = (app, middleware, plugin) => msg => buildFindOne(app, middleware, msg);

function buildFindOne(app, middleware, msg) {
  let schema = msg.schema;
  var _msg$criteria = msg.criteria;
  let criteria = _msg$criteria === undefined ? {} : _msg$criteria;
  var _msg$options = msg.options;
  let options = _msg$options === undefined ? {} : _msg$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;


  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new _promise2.default((resolve, reject) => {
    let __fields = schema.getMyFields(fields);
    criteria = schema.getMyCriteriaParams(criteria);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), criteria, reject).select(...__fields).limit(1);

    if (outer) {
      // Если кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    // Иначе вызовем его выполнение
    builder.then((_ref) => {
      var _ref2 = (0, _slicedToArray3.default)(_ref, 1);

      let result = _ref2[0];

      if (!result) {
        return null;
      }

      const record = (0, _convertToResponse2.default)(schema, __fields)(result);

      return schema.assignLinksToOne(record, pin => msg.act(pin)).then(() => record);
    }).then(resolve).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO)).catch(reject);
  });
}
//# sourceMappingURL=one.js.map