const format = require('pg-format');
const db = require('../connection');


const seed = ({eventData, categoryData, locationData}) => {
    return db.query(`DROP TABLE IF EXISTS events;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS locations;`);
    })
    // .then(() => {
    //     return db.query(`DROP TABLE IF EXISTS comments;`);
    // })
    // .then(() => {
    //     return db.query(`DROP TABLE IF EXISTS users;`);
    // })

    .then(() => {
         // Create categories and locations tables
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

        return Promise.all([categoriesTablePromise, locationsTablePromise]);
    })
    .then(() => {
        return db.query(`
        CREATE TABLE events (
            event_id SERIAL PRIMARY KEY,
            event_name VARCHAR(255) NOT NULL,
            category VARCHAR NOT NULL REFERENCES categories(slug),
            description TEXT,
            date DATE,
            time TIME,
            ticket_price DECIMAL(4, 2),
            location INT REFERENCES locations(location_id),
            image_url VARCHAR(255)
            );`
        );
    })
        .then(() => {
             // Insert data into categories and locations tables
            const insertCategoriesQueryStr = format(
                `INSERT INTO categories(slug, description) VALUES %L;`,
                categoryData.map(({slug, description}) =>[slug, description])
            );
            const categoriesPromise = db.query(insertCategoriesQueryStr);

            const insertLocationsQueryStr = format(
                `INSERT INTO locations(location_id, postcode, first_line_address,
                    second_line_address, city) VALUES %L;`,
                locationData.map(({location_id, postcode, first_line_address, 
                        second_line_address, city}) =>
                            [location_id, 
                            postcode, 
                            first_line_address, 
                            second_line_address, 
                            city])
                );
            const locationsPromise = db.query(insertLocationsQueryStr);
            return Promise.all([categoriesPromise, locationsPromise]);
        })
        .then(() => {
            const insertEventsQueryStr = format(
                `INSERT INTO events (
                    event_name, category, description, date, time, ticket_price, 
                    location, image_url) VALUES %L;`,
                    eventData.map(({
                        event_name, category, description, date, time, 
                        ticket_price, location, image_url
                    }) => [
                        event_name, category, description, date, time, 
                        ticket_price, location, image_url]
                    )
                );
                return db.query(insertEventsQueryStr);
            });
    
};
module.exports = seed;

    
