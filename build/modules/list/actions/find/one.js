'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    return Promise.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return Promise.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
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
      var _ref2 = _slicedToArray(_ref, 1);

      let result = _ref2[0];
      return new Promise((() => {
        var _ref3 = _asyncToGenerator(function* (resolve) {
          if (!result) {
            return resolve(result);
          }

          const record = (0, _convertToResponse2.default)(schema, __fields)(result);

          resolve((yield schema.assignLinksToOne(record, function (pin) {
            return msg.act(pin);
          })));
        });

        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      })());
    }).then(resolve).catch((0, _errors.internalErrorPromise)(app, ERROR_INFO)).catch(reject);
  });
}
//# sourceMappingURL=one.js.map