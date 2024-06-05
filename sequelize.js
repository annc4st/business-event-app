// sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}`,
});

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Use this if you get self-signed certificate errors
      },
    },
    logging: false,
  });
} else {
  const database = process.env.PGDATABASE;
  const username = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || 'password';
  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || 5432;

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = sequelize;
