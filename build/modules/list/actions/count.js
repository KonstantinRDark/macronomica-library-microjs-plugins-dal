'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildCount = buildCount;

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setCriteria = require('./../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'count' };

exports.default = (app, middleware, plugin) => msg => buildCount(app, middleware, msg);

function buildCount(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer;


  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new _promise2.default((resolve, reject) => {
    criteria = schema.getMyCriteriaParams(criteria);

    let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), criteria, reject).count();
    /*
    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }
    */
    if ( /*transaction || */outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    return builder
    // Заглушка count(*) для sqllite3
    .then((_ref2) => {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 1);

      let result = _ref3[0];
      return { count: result.count || result['count(*)'] };
    }).then(resolve).catch(error => reject((0, _errors.internalErrorPromise)(app, ERROR_INFO)(error)));
  });
}
//# sourceMappingURL=count.js.map