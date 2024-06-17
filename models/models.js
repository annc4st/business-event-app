const db = require("../db/connection.js");
const format = require("pg-format");
const convertToUTC = require("./util_func");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
  });
};
exports.insertCategory = (newCat) => {
  const { slug, description } = newCat;
  return db
    .query(
      `
    INSERT INTO categories 
    (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )

    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCategory = async (slug) => {
  const catExists = await db.query(
    `SELECT * FROM categories WHERE slug = $1;`,
    [slug]
  );
  if (catExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Category does not exist" });
  }
  return db.query(`DELETE FROM categories WHERE slug = $1;`, [slug]);
};

exports.updateCategory = async (slug, newDescription) => {
  const catExists = await db.query(
    `SELECT * FROM categories WHERE slug = $1;`,
    [slug]
  );
  if (catExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Category does not exist" });
  }
  return db
    .query(
      `
  UPDATE categories SET description =$2 WHERE slug = $1 RETURNING *;`,
      [slug, newDescription]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchEvents = async (category) => {
  let eventsQuery;

  if (category) {
    const categoryExists = await db.query(
      `SELECT slug FROM categories WHERE slug = $1;`,
      [category]
    );

    if (categoryExists.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Category does not exist",
      });
    }

    eventsQuery = `SELECT 
        events.event_id,
        events.event_name, 
        events.description, 
        events.start_t,
        events.end_t,
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
      WHERE events.category = '${category}';`;
  } else {
    eventsQuery = `SELECT 
        events.event_id,
        events.event_name, 
        events.description, 
        events.start_t,
        events.end_t,
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
  const eventsWithAttendees = await Promise.all(
    result.rows.map(async (event) => {
      const attendeesQuery = `
          SELECT users.id, users.username, users.email, users.thumbnail 
          FROM eventguests
          JOIN users ON eventguests.guest_id = users.id
          WHERE eventguests.event_id = $1;`;
      const attendeesResult = await db.query(attendeesQuery, [event.event_id]);
      event.attendees = attendeesResult.rows;
      return event;
    })
  );

  return eventsWithAttendees;
};

exports.fetchEventById = async (id) => {
  const eventQuery = `
      SELECT 
        events.event_id, 
        events.event_name, 
        events.description, 
        events.start_t,
        events.end_t,
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
      WHERE events.event_id = $1;`;

  const eventResult = await db.query(eventQuery, [id]);

  if (eventResult.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Event does not exist." });
  }

  const guestQuery = `
      SELECT 
        users.id, 
        users.username, 
        users.email, 
        users.thumbnail 
      FROM eventguests
      JOIN users ON eventguests.guest_id = users.id
      WHERE eventguests.event_id = $1;`;

  const guestCountQuery = `SELECT COUNT(*) AS guest_count FROM eventguests WHERE event_id = $1;`;

  const [guestsResult, guestCountResult] = await Promise.all([
    db.query(guestQuery, [id]),
    // db.query(guestCountQuery, [id])
  ]);

  const event = eventResult.rows[0];
  event.attendees = guestsResult.rows;

  return event;
};

exports.insertEvent = async (newEvent) => {
  let {
    event_name,
    category,
    description,
    startdate,
    starttime,
    enddate,
    endtime,
    ticket_price,
    location,
    image_url,
  } = newEvent;

  if (!image_url) {
    image_url =
      "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
  }

  if (category) {
    const categoryExists = await db.query(
      `
          SELECT slug FROM categories WHERE slug = $1;`,
      [category]
    );

    if (categoryExists.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Category does not exist",
      });
    }
  }

  if (location) {
    const locationExists = await db.query(
      `
          SELECT location_id FROM locations WHERE location_id = $1;`,
      [location]
    );

    if (locationExists.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Location does not exist",
      });
    }
  }

  // const timestamp = new Date(new Date(`${date}T${time}Z`).getTime() - new Date(`${date}T${time}Z`).getTimezoneOffset() *60000).toISOString();

  const start_t = convertToUTC(startdate, starttime);
  const end_t = convertToUTC(enddate, endtime);
  const query = `
    INSERT INTO events (event_name, category, description, start_t, end_t, ticket_price, location, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `;

  const values = [
    event_name,
    category,
    description,
    start_t,
    end_t,
    ticket_price,
    location,
    image_url,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.removeEvent = async (event_id) => {
  const eventExists = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
    [event_id]
  );

  if (eventExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Event does not exist." });
  }

  await db.query("BEGIN");
  try {
    await db.query(`DELETE FROM eventguests WHERE event_id = $1;`, [event_id]);
    await db.query(`DELETE FROM events WHERE event_id =$1;`, [event_id]);
    await db.query("COMMIT");
    return {
      status: 204,
      message: "Event and associated guests successfully deleted.",
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query("ROLLBACK");
    throw error;
  }
};

//LOCATIONS
exports.fetchLocations = () => {
  return db.query(`SELECT * FROM locations;`).then(({ rows }) => {
    return rows;
  });
};

exports.insertLocation = (newLoc) => {
  const { postcode, first_line_address, second_line_address, city } = newLoc;
  return db
    .query(
      `INSERT INTO locations (postcode, first_line_address, second_line_address, city)
     VALUES ($1, $2, $3, $4) RETURNING *; `,
      [postcode, first_line_address, second_line_address, city]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchLocationById = async (id) => {
  const locationQuery = `
  SELECT * FROM locations WHERE location_id = $1;`;

  const locationExists = await db.query(locationQuery, [id]);

  if (locationExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Location does not exist" });
  }

  try {
    const result = await db.query(locationQuery, [id]);
    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.removeLocation = async (id) => {
  const locationQuery = `SELECT * FROM locations WHERE location_id = $1;`;

  const locationExists = await db.query(locationQuery, [id]);
  if (locationExists.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Location does not exist" });
  }

  try {
    return db.query(`DELETE FROM locations WHERE location_id = $1;`, [id]);
  } catch (err) {
    throw err;
  }
};

exports.fetchEventGuests = async (event_id) => {
  const eventQuery = `
    SELECT *  FROM events
    WHERE events.event_id = $1;`;

  const eventResult = await db.query(eventQuery, [event_id]);

  if (eventResult.rows.length === 0) {
    return Promise.reject({ status: 404, message: "Event does not exist." });
  }

  const guestQuery = `
    SELECT users.id, users.username, users.email, users.thumbnail
    FROM eventguests
    JOIN users ON eventguests.guest_id = users.id
    WHERE eventguests.event_id = $1;`;

  let guestCountQuery = `SELECT COUNT(*) AS guest_count FROM eventguests WHERE event_id = $1;`;

  const [guestsResult, guestCountResult] = await Promise.all([
    db.query(guestQuery, [event_id]),
    db.query(guestCountQuery, [event_id]),
  ]);

  return {
    guests: guestsResult.rows,
    guest_count: guestCountResult.rows[0].guest_count,
  };
};

exports.updateGuestList = async (event_id, user_id) => {
  const eventExists = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
    [event_id]
  );

  if (eventExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Event does not exist.",
    });
  }

  const userExists = await db.query(`SELECT * FROM users WHERE id = $1;`, [
    user_id,
  ]);
  if (userExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "User does not exist.",
    });
  }

  const guestAlreadyExists = await db.query(
    `SELECT * FROM eventguests WHERE event_id = $1 AND guest_id = $2;`,
    [event_id, user_id]
  );
  if (guestAlreadyExists.rows.length != 0) {
    return Promise.reject({
      status: 401,
      message: "This user has already signed up for the event.",
    });
  }

  await db.query(
    `
    INSERT INTO eventguests(event_id, guest_id)
    VALUES($1, $2)
    ON CONFLICT DO NOTHING;`,
    [event_id, user_id]
  );

  const guestList = await db.query(
    `SELECT * FROM eventguests WHERE event_id = $1;`,
    [event_id]
  );

  return guestList.rows[0];
};

exports.removeGuestFromEvent = async (event_id, user_id) => {
  const eventExists = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
    [event_id]
  );

  if (eventExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Event does not exist",
    });
  }

  const userExists = await db.query(`SELECT * FROM users WHERE id = $1;`, [
    user_id,
  ]);
  if (userExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "User does not exist.",
    });
  }
  const guestExists = await db.query(
    `SELECT * FROM eventguests WHERE event_id = $1 AND guest_id = $2;`,
    [event_id, user_id]
  );
  if (guestExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "This user is not signed up for the event.",
    });
  }
  await db.query(
    `
    DELETE FROM eventguests
    WHERE event_id = $1 AND guest_id = $2;`,
    [event_id, user_id]
  );

  const guestList = await db.query(
    `SELECT * FROM eventguests WHERE event_id = $1;`,
    [event_id]
  );

  return guestList.rows;
};

/*
exports.fetchUserEvents = async (userId) => {
  const guestExists = await db.query(
    `SELECT guest_id FROM eventguests WHERE guest_id = $1;`, [userId]
  );

  if(guestExists.rows.length ===0) {
    return Promise.reject({
      status: 404,
      message: "User has not signed up for any events.",
    });
  }

  let eventsOfUserQuery = `SELECT 
  eventguests.guest_id, eventguests.event_id,
        events.event_name, 
        events.description, 
        events.start_t,
        events.end_t,
  FROM eventguests
  JOIN events ON eventguests.event_id = events.event_id
  WHERE eventguests.guest_id = $1;`
  
  const result = await db.query(eventsOfUserQuery, [userId] );
  return result.rows;
}
  */