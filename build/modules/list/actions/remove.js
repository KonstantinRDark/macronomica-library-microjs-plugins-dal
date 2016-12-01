'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildRemove = buildRemove;

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setCriteria = require('./../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _checkConvertOut = require('./../../../utils/check-convert-out');

var _checkConvertOut2 = _interopRequireDefault(_checkConvertOut);

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'remove' };

exports.default = (app, middleware, plugin) => msg => buildRemove(app, middleware, msg);

function buildRemove(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;

  const convertOuts = (0, _checkConvertOut2.default)(schema.properties);

  if (!schema) {
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    criteria = schema.getMyParams(criteria);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), criteria, reject).del().returning(...schema.getMyFields(fields));
    /*
    if (transaction) {
      // Если передали внешнюю транзакцию - привяжемся к ней
      builder = builder.transacting(transaction);
    }
    */
    if ( /*transaction || */outer) {
      // Если передали внешнюю транзакцию или кто-то сам хочет запускать запрос - вернем builder
      return resolve(builder);
    }

    builder.then(result => {
      if (!result) {
        resolve(null);
      }

      for (let _ref2 of convertOuts) {
        let name = _ref2.name;
        let callback = _ref2.callback;

        result[name] = callback(result[name], schema.properties[name]);
      }

      resolve(_extends({}, result));
    }).catch((0, _errors.internalError)(app, ERROR_INFO)).catch(reject);
  });
}
//# sourceMappingURL=remove.js.map