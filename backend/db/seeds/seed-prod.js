const postgres = require('postgres');
const { convertToUTC } = require('../../models/util_func');
const bcrypt = require('bcrypt');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

const seedProduction = async ({ eventData, categoryData, locationData, userData }) => {
  try {
    // Example with postgres tagged template literals for production
    await sql`DROP TABLE IF EXISTS eventguests`;
    await sql`DROP TABLE IF EXISTS events`;
    await sql`DROP TABLE IF EXISTS categories`;
    await sql`DROP TABLE IF EXISTS locations`;
    await sql`DROP TABLE IF EXISTS users`;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS locations (
        location_id SERIAL PRIMARY KEY,
        postcode VARCHAR(8),
        first_line_address VARCHAR(255),
        second_line_address VARCHAR(255),
        city VARCHAR(255)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        hashed_password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'user'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        event_id SERIAL PRIMARY KEY,
        event_name VARCHAR(255) NOT NULL,
        category VARCHAR NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
        description TEXT,
        start_t TIMESTAMP NOT NULL,
        end_t TIMESTAMP NOT NULL,
        ticket_price DECIMAL(4, 2),
        location INT REFERENCES locations(location_id),
        image_url VARCHAR(255)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS eventguests (
        event_id INT REFERENCES events(event_id),
        guest_id INT REFERENCES users(id),
        PRIMARY KEY (event_id, guest_id)
      )
    `;

    await sql`INSERT INTO categories ${sql(categoryData, 'slug', 'description')}`;
    await sql`INSERT INTO locations ${sql(locationData, 'postcode', 'first_line_address', 'second_line_address', 'city')}`;

    const hashedUserData = await Promise.all(userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.userpassword, 10);
      return {
        username: user.username,
        hashed_password: hashedPassword,
        email: user.email,
        role: user.role
      };
    }));

    await sql`INSERT INTO users ${sql(hashedUserData, 'username', 'hashed_password', 'email', 'role')}`;

    const eventValues = eventData.map(({
      event_name, category, description, startdate, starttime, enddate, endtime,
      ticket_price, location, image_url
    }) => ({
      event_name,
      category,
      description,
      start_t: convertToUTC(startdate, starttime),
      end_t: convertToUTC(enddate, endtime),
      ticket_price,
      location,
      image_url
    }));

    await sql`INSERT INTO events ${sql(eventValues, 'event_name', 'category', 'description', 'start_t', 'end_t', 'ticket_price', 'location', 'image_url')}`;

  } catch (err) {
    console.error('Error seeding production database:', err);
  }
};

module.exports = seedProduction;
