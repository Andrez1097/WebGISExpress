const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'calidad_aire',
  password: 'postgres',
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;