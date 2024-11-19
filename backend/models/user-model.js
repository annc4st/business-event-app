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
        events.end_t
            FROM eventguests
            JOIN events ON eventguests.event_id = events.event_id
            WHERE eventguests.guest_id = $1;`

        const result = await db.query(userSignedUpEventsQery, [userId]);
        return result.rows;
    }
 

 