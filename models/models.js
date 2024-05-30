const db = require("../db/connection.js");


exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    .then(({rows}) => {
        return rows;
    });
}

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