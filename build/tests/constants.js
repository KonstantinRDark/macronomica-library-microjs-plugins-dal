'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const CONNECT_OPTIONS = exports.CONNECT_OPTIONS = {
  driver: 'sqlite3',
  filename: ':memory:'
};

const CONNECT_OPTIONS_PG = exports.CONNECT_OPTIONS_PG = {
  'driver': 'postgres',
  'host': '127.0.0.1',
  'port': '5432',
  'database': 'macronomica-test',
  'user': 'postgres',
  'password': 'postgres'
};
//# sourceMappingURL=constants.js.map