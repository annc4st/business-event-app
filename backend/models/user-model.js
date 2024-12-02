const db = require('../db/connection');


    exports.fetchUserSignedUpEvents = async (userId) => {
        const userSignedUpExists = await db.query (
            `SELECT * FROM eventguests WHERE guest_id = $1;`, [userId]
        )

        if(userSignedUpExists.rows.length === 0){
            return Promise.reject({status: 404, message: "User has not signed up for any events."})
        }

        let userSignedUpEventsQery = `SELECT 
        eventguests.guest_id, 
        eventguests.event_id,
        events.event_name, 
        events.description, 
        events.start_t,
        events.end_t,

        locations.postcode, 
            locations.first_line_address, 
            locations.second_line_address, 
            locations.city
            FROM eventguests
            JOIN events ON eventguests.event_id = events.event_id
            JOIN locations ON events.location = locations.location_id
            WHERE eventguests.guest_id = $1;`

        const result = await db.query(userSignedUpEventsQery, [userId]);
        return result.rows;
    }

    // exports.fetchUserSingleEventDets = async (userId, eventId) => {
    //     const eventExists = await db.query(`
    //         SELECT * FROM events WHERE event_id = $1;`, [eventId])
    //     if(eventExists.rows.length === 0){
    //             return Promise.reject({status: 404, message: "Event does not exist"})
    //         }

    //     let userSingleEventDetsQuery = `SELECT 
    //     events.event_id, 
    //     events.event_name, 
    //     events.description, 
    //     events.start_t,
    //     events.end_t,
    //     events.ticket_price, 
    //     events.image_url,
    //     categories.slug AS category, 
    //     locations.postcode, 
    //     locations.first_line_address, 
    //     locations.second_line_address, 
    //     locations.city
    //   FROM events
    //   JOIN categories ON events.category = categories.slug
    //   JOIN locations ON events.location = locations.location_id
    //   WHERE events.event_id = $1;`

    //   const detsResult = await db.query(userSingleEventDetsQuery, [eventID]);
    //     if (detsResult.rows.length === 0) {
    //         return Promise.reject({ status: 404, message: "Event does not exist." });
    //     }
    // }
 

 