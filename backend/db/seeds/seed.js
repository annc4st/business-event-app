const format = require('pg-format');
const db = require('../connection');
const {convertToUTC} = require('../../models/util_func');
const bcrypt = require('bcrypt');


const seed = async ({ eventData, categoryData, locationData, userData }) => {
    try {

//dev
        await db.query(`DROP TABLE IF EXISTS eventguests;`);
        await db.query(`DROP TABLE IF EXISTS events;`);
        await db.query(`DROP TABLE IF EXISTS categories;`);
        await db.query(`DROP TABLE IF EXISTS locations;`);
        await db.query(`DROP TABLE IF EXISTS users;`);

        const categoriesTablePromise = db.query(`
            CREATE TABLE categories (
                slug VARCHAR PRIMARY KEY,
                description VARCHAR
            );
        `);

        const locationsTablePromise = db.query(`
            CREATE TABLE locations (
                location_id SERIAL PRIMARY KEY,
                postcode VARCHAR(8),
                first_line_address VARCHAR(255),
                second_line_address VARCHAR(255),
                city VARCHAR(255)
            );
        `);

        const usersTablePromise = db.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                hashed_password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);

        await Promise.all([categoriesTablePromise, locationsTablePromise, usersTablePromise]);

        await db.query(`
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
            );
        `);

        await db.query(`
            CREATE TABLE eventguests (
                event_id INT REFERENCES events(event_id),
                guest_id INT REFERENCES users(id),
                PRIMARY KEY (event_id, guest_id)
            );
        `);

        // Insert data into categories and locations tables
        const insertCategoriesQueryStr = format(
            `INSERT INTO categories(slug, description) VALUES %L;`,
            categoryData.map(({ slug, description }) => [slug, description])
        );
        const categoriesPromise = db.query(insertCategoriesQueryStr);

        const insertLocationsQueryStr = format(
            `INSERT INTO locations(postcode, first_line_address, second_line_address, city) VALUES %L;`,
            locationData.map(({ postcode, first_line_address, second_line_address, city }) =>
                [postcode, first_line_address, second_line_address, city])
        );
        const locationsPromise = db.query(insertLocationsQueryStr);

        // Hash the passwords before inserting users
        const hashedUserData = await Promise.all(userData.map(async (user) => {
            if (!user.userpassword) {
                throw new Error(`User ${user.username} does not have a password`);
            }
            const hashedPassword = await bcrypt.hash(user.userpassword, 10);
            return {
                username: user.username,
                hashed_password: hashedPassword,
                email: user.email,
                role: user.role
            };
        }));

        const insertUsersQueryStr = format(
            `INSERT INTO users (username, hashed_password, email, role) VALUES %L;`,
            hashedUserData.map(({ username, hashed_password, email, role }) =>
                [username, hashed_password, email, role])
        );
        const usersPromise = db.query(insertUsersQueryStr);

        await Promise.all([categoriesPromise, locationsPromise, usersPromise]);

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
                    ticket_price, location, image_url
                ];
            })
        );
        await db.query(insertEventsQueryStr);

    } catch (err) {
            console.error('Error seeding database:', err);
        }

};

module.exports = seed;
