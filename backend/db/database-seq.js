// using sequelize
require('dotenv').config();
const { Sequelize } = require('sequelize')


const ENV = process.env.NODE_ENV || 'development';

const config = {
  dialect: 'postgres',
};

let sequelize;

if (ENV === 'production') {
  // ✅ Use DATABASE_URL in production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for NeonDB
      },
    },
  });
} else {
  // ✅ Use individual PG env vars in development
  sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
  });
}

// ✅ Connect to DB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to PostgreSQL: ${sequelize.getDatabaseName()}`);
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
  }
};

module.exports = { sequelize, connectDB };
 