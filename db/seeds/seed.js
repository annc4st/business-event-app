const format = require('pg-format');
const db = require('../connection');
const convertToUTC = require('../../models/util_func')


const seed = ({ eventData, categoryData, locationData, userData}) => {
    return db.query(`DROP TABLE IF EXISTS eventguests;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS events;`)
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS categories;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS locations;`);
        })

        .then(() => {
            return db.query(`DROP TABLE IF EXISTS users;`);
        })

        .then(() => {

            const categoriesTablePromise = db.query(
                `CREATE TABLE categories (
            slug VARCHAR PRIMARY KEY,
            description VARCHAR
        );`);

            const locationsTablePromise = db.query(`
        CREATE TABLE locations (
            location_id SERIAL PRIMARY KEY,
            postcode VARCHAR(8),
            first_line_address VARCHAR(255),
            second_line_address VARCHAR(255),
            city VARCHAR(255)
            );`
            );

            const usersTablePromise = db.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            google_id VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            thumbnail VARCHAR(255)
        );`
            );

            return Promise.all([categoriesTablePromise, locationsTablePromise, usersTablePromise]);
        })
        .then(() => {
            return db.query(`
        CREATE TABLE events (
            event_id SERIAL PRIMARY KEY,
            event_name VARCHAR(255) NOT NULL,
            category VARCHAR NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
            description TEXT,
            start_t TIMESTAMP NOT NULL,
            end_t TIMESTAMP NOT NULL,
            ticket_price DECIMAL(4, 2),
            location INT REFERENCES locations(location_id),
            image_url VARCHAR(255)
            );`
            );
        })
        .then(() => {
            return db.query(`
                CREATE TABLE eventguests (
                    event_id INT REFERENCES events(event_id),
                    guest_id INT REFERENCES users(id),
                    PRIMARY KEY (event_id, guest_id)
                );`
            );
        })
        .then(() => {
            // Insert data into categories and locations tables
            const insertCategoriesQueryStr = format(
                `INSERT INTO categories(slug, description) VALUES %L;`,
                categoryData.map(({ slug, description }) => [slug, description])
            );
            const categoriesPromise = db.query(insertCategoriesQueryStr);

            const insertLocationsQueryStr = format(
                `INSERT INTO locations(location_id, postcode, first_line_address,
                    second_line_address, city) VALUES %L;`,
                locationData.map(({ location_id, postcode, first_line_address,
                    second_line_address, city }) =>
                    [location_id, postcode,
                        first_line_address,
                        second_line_address,
                        city])
            );
            const locationsPromise = db.query(insertLocationsQueryStr);

            const insertUsersQueryStr = format(
                `INSERT INTO users (google_id, username, email, role, thumbnail) VALUES %L;`,
                userData.map(({
                     google_id, username, email, role, thumbnail }) => 
                        [google_id, username, email, role, thumbnail])
                    );
              const usersPromise = db.query(insertUsersQueryStr);
         
              return Promise.all([categoriesPromise, locationsPromise, usersPromise]);
            })

        .then(() => {
            const insertEventsQueryStr = format(
                `INSERT INTO events(
                    event_name, category, description, start_t, end_t, ticket_price, 
                    location, image_url) VALUES %L;`,
                eventData.map(({
                    event_name, category, description, startdate, starttime, enddate, endtime,
                    ticket_price, location, image_url
                }) => {

                    const start_t = convertToUTC(startdate, starttime);
                    const end_t = convertToUTC(enddate, endtime);
                    return [
                        event_name, category, description, start_t, end_t,
                        ticket_price, location, image_url]
                    })
            );
            return db.query(insertEventsQueryStr);
        })
        .catch((err) => {
            console.error('Error seeding database:', err);
          });

};
module.exports = seed;


