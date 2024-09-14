const { Pool } = require('pg');


require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}`,
});

// Check for required environment variables
if (!process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGHOST) {
  throw new Error('Required environment variables are not set');
}
 

//Configure the postgresql client
const config = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432, // Use default port if not specified
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Enable SSL in production
  ssl: false,
}

module.exports = new Pool(config);