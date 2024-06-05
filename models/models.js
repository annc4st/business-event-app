const db = require("../db/connection.js");
const format = require('pg-format');

const { convertToUTC } = require('./util_func.js');

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
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

exports.removeCategory = async (slug) => {
  const catExists = await db.query(`SELECT * FROM categories WHERE slug = $1;`, [slug])
  if (catExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: 'Category does not exist' });
  }
  return db.query(
    `DELETE FROM categories WHERE slug = $1;`, [slug])
};

exports.updateCategory = async(slug,  newDescription) =>{
  const catExists = await db.query(`SELECT * FROM categories WHERE slug = $1;`, [slug])
  if (catExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: 'Category does not exist' });
  }
  return db.query(`
  UPDATE categories SET description =$2 WHERE slug = $1 RETURNING *;`, [slug, newDescription])
  .then((result) => {
    return result.rows[0];
  });
};

  exports.fetchEvents = async (category) => {
    let eventsQuery;

    if (category) {
      const categoryExists = await db.query(`
            SELECT slug FROM categories WHERE slug = $1;`, [category]);

      if (categoryExists.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Category does not exist" });
      }

      eventsQuery = `SELECT 
        events.event_id,
        events.event_name, 
        events.description, 
        events.timestamp,
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
        events.event_id,
        events.event_name, 
        events.description, 
        events.timestamp,
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

    const result = await db.query(eventsQuery);

    const eventsWithAttendees = await Promise.all(result.rows.map(async (event) => {
      const attendeesQuery = `
          SELECT users.id, users.username, users.email, users.thumbnail 
          FROM eventguests
          JOIN users ON eventguests.guest_id = users.id
          WHERE eventguests.event_id = $1;`;
      const attendeesResult = await db.query(attendeesQuery, [event.event_id]);
      event.attendees = attendeesResult.rows;
      return event;
  }));

  return eventsWithAttendees;
  }


exports.fetchEventById = async (id) => {
  let eventQuery;

  eventQuery = `SELECT 
      events.event_id, 
      events.event_name, 
      events.description, 
      events.timestamp,
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
    WHERE events.event_id = $1;`

    const result = await db.query(eventQuery, [id])

    const eventWithGuests = await Promise.all(result.rows.map(async (event) => {
      const attendeesQuery = `
          SELECT users.id, users.username, users.email, users.thumbnail 
          FROM eventguests
          JOIN users ON eventguests.guest_id = users.id
          WHERE eventguests.event_id = $1;`;
          const attendeesResult = await db.query(attendeesQuery, [event.event_id]);
          event.attendees = attendeesResult.rows;
          return event
    }));
    return eventWithGuests;
};

exports.insertEvent = async (newEvent) => {
  let { event_name, category, description,
    date, time, ticket_price, location, image_url
  } = newEvent;

  // Convert date and time to UTC
  // const utcDateTime = convertToUTC(date, time);
  

  if (!image_url) {
    image_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
  }

  if (category) {
    const categoryExists = await db.query(`
          SELECT slug FROM categories WHERE slug = $1;`, [category]);

    if (categoryExists.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Category does not exist" });
    }
  }

  if (location) {
    const locationExists = await db.query(`
          SELECT location_id FROM locations WHERE location_id = $1;`, [location]);

    if (locationExists.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Location does not exist" });
    }
  }

  const timestamp = new Date(new Date(`${date}T${time}Z`).getTime() - new Date(`${date}T${time}Z`).getTimezoneOffset() *60000).toISOString();

  const query = `
    INSERT INTO events (event_name, category, description, timestamp, ticket_price, location, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;

  const values = [event_name, category, description, timestamp, ticket_price, location, image_url];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.removeEvent = async(event_id) => {
  const eventExists = await db.query(`SELECT * FROM events WHERE event_id = $1;`, [event_id]);

  if (eventExists.rows.length ===0) {
    return Promise.reject({
      status: 404, message: 'Event does not exist'
    })
  } 
  return db.query(`DELETE FROM events WHERE event_id =$1;`, [event_id]);
}

exports.updateEvent = async(event_id, user_id) => {

  const eventExists = await db.query(`SELECT * FROM events WHERE event_id = $1;`, [event_id]);

  if (eventExists.rows.length ===0) {
    return Promise.reject({
      status: 404, message: 'Event does not exist'
    })
  } 

  const userExists = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]);
  if (userExists.rows.length === 0) {
    return Promise.reject({
        status: 404, message: 'User does not exist'
    });
}
 
  await db.query(`
    INSERT INTO eventguests(event_id, guest_id)
    VALUES($1, $2)
    ON CONFLICT DO NOTHING;`, [event_id, user_id]);

  const updatedEvent = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
     [event_id]);

     return updatedEvent.rows[0];

}
  