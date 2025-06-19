const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // 👈 Add this line to avoid SSL errors (especially on localhost)
});

module.exports = pool;
