// using sequelize
require('dotenv').config();
const { Sequelize } = require('sequelize')


// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
});

//connectDB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
};

module.exports = { sequelize, connectDB };