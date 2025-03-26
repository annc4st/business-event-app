const { Pool } = require('pg');

const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}`,
});


if ((ENV === 'development' && (!process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGHOST)) 
  || (ENV === 'production' && !process.env.DATABASE_URL)) {
throw new Error('Required environment variables are not set');
}
 
const config = {};
if (ENV === 'production') {
  config.connectionString =  process.env.DATABASE_URL;
  config.ssl  = {
    rejectUnauthorized: false, // This allows self-signed certificates (if used by the host)
  };
  config.max = 2;
  
}


module.exports = new Pool(config);