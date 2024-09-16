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
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}


//Configure the postgresql client
// const config = {
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT || 5432,  
//   ssl: {
//     rejectUnauthorized: false, 
//   },

// }

// if (process.env.NODE_ENV === 'production') {
//   config.ssl = { rejectUnauthorized: false };
// }

module.exports = new Pool(config);