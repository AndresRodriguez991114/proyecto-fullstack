// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.vsoroeoqjkfzuphiohgh',       // DB_USER
  host: 'aws-1-us-east-1.pooler.supabase.com', // DB_HOST
  database: 'postgres',                         // DB_NAME
  password: '3133326141An',                     // DB_PASS
  port: 5432,                                   // DB_PORT
});

module.exports = pool;
