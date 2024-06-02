const db = require("../db/connection.js");

const { convertToUTC } = require('./util_func.js');

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`)
  .then(({rows}) => {
      return rows;
  });
}
exports.insertCategory = (newCat) => {
  const { slug, description } = newCat;
  return db.query(`
    INSERT INTO categories 
    (slug, description) VALUES ($1, $2) RETURNING *;`,
    [slug, description])

    .then((result) => {
      return result.rows[0];
    });
  }

  exports.removeCategory = async(slug) => {
    const catExists = await db.query(`SELECT * FROM categories WHERE slug = $1;`, [slug])
    if (catExists.rows.length === 0) {
      return Promise.reject({ status: 404, message: 'Category does not exist' });
    }
    return db.query(
      `DELETE FROM categories WHERE slug = $1;`, [slug])
  };

  exports.updateCategory = 

exports.fetchEvents = async (category) => {
    let eventsQuery;

    if(category) {
        const categoryExists = await db.query(`
            SELECT slug FROM categories WHERE slug = $1;`, [category]);

        if(categoryExists.rows.length === 0) {
            return Promise.reject({status: 404, message: "Category does not exist"});
        }

        eventsQuery = `SELECT 
        events.event_name, 
        events.description, 
        events.date, 
        events.time, 
        events.ticket_price, 
        events.image_url, 
        categories.slug AS category, 
        locations.postcode, 
        locations.first_line_address, 
        locations.second_line_address, 
        locations.city
      FROM events
      JOIN categories ON events.category = categories.slug
      JOIN locations ON events.location = locations.location_id
      WHERE events.category = '${category}';` 
    } else {
        eventsQuery = `SELECT 
        events.event_name, 
        events.description, 
        events.date, 
        events.time, 
        events.ticket_price, 
        events.image_url, 
        categories.slug AS category, 
        locations.postcode, 
        locations.first_line_address, 
        locations.second_line_address, 
        locations.city
      FROM events
      JOIN categories ON events.category = categories.slug
      JOIN locations ON events.location = locations.location_id;
      `;
    }
    const { rows } = await db.query(eventsQuery);
    return rows;

    }

exports.fetchEventById = (id) => {
    return db.query(`
    SELECT 
      events.event_id, 
      events.event_name, 
      events.description, 
      events.date, 
      events.time, 
      events.ticket_price, 
      events.image_url, 
      categories.slug AS category, 
      locations.postcode, 
      locations.first_line_address, 
      locations.second_line_address, 
      locations.city
    FROM events
    JOIN categories ON events.category = categories.slug
    JOIN locations ON events.location = locations.location_id
    WHERE events.event_id = $1;`, [id])
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, message: "Event does not exist" });
        }
        return result.rows[0];
      });
  };

  exports.insertEvent = async(newEvent) => {
    let {event_name, category, description,
        date, time, ticket_price, location, image_url
    } = newEvent;

    // Convert date and time to UTC
    const utcDateTime = convertToUTC(date, time);

    if(!image_url) {
      image_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
    }

    if(category) {
      const categoryExists = await db.query(`
          SELECT slug FROM categories WHERE slug = $1;`, [category]);

      if(categoryExists.rows.length === 0) {
          return Promise.reject({status: 404, message: "Category does not exist"});
      }
    }

    if(location) {
      const locationExists = await db.query(`
          SELECT location_id FROM locations WHERE location_id = $1;`, [location]);

      if(locationExists.rows.length === 0) {
          return Promise.reject({status: 404, message: "Location does not exist"});
      }
    }

    const query = `
    INSERT INTO events (event_name, category, description, date, 
      time, ticket_price, location, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `;

    const values = [event_name, category, description,
       utcDateTime.split('T')[0], 
       utcDateTime.split('T')[1], ticket_price, location, image_url];
     
     
      try {
        const result = await db.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
};
//     return result.rows[0];

//     return db.query(`
//       INSERT into events (event_name, category, description, date, time,
//         ticket_price, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//         RETURNING *;`, [event_name, category, description, date, time,
//           ticket_price, location, image_url]
//     )
//     .then((data) => {
//       const result = data.rows[0];
//       return result;
//     })
//     .catch((error) => {
//       throw error; 
//     });
//  }