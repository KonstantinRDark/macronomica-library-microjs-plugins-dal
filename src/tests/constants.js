
export const CONNECT_OPTIONS = {
  driver  : 'sqlite3',
  filename: ':memory:'
};

export const CONNECT_OPTIONS_PG = {
  'driver'  : 'postgres',
  'host'    : '127.0.0.1',
  'port'    : '5432',
  'database': 'macronomica-test',
  'user'    : 'postgres',
  'password': 'postgres'
};