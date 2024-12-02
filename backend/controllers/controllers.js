const fs = require("fs/promises");
const path = require("path");
const upload = require('../middlewares/upload');



const {
    fetchCategories,
    insertCategory,
    removeCategory,
    updateCategory,
    fetchEvents,
    fetchEventById,
    insertEvent,
    removeEvent, 
    updateGuestList,
    fetchLocations,
    fetchLocationById,
    insertLocation, removeLocation,
    fetchEventGuests, removeGuestFromEvent

        } = require("../models/models.js");

    const { fetchUserSignedUpEvents } = require('../models/user-model.js')



exports.getCategories = (req, res, next) => {
    fetchCategories()
    .then((categories) =>{
        res.status(200).send(categories);
    })
    .catch((err) =>{
        next(err);
    });
}

exports.postCategory= (req, res, next) => {
    const newCat = req.body;

    if (!newCat.slug || !newCat.description) {
        return res.status(422).send({message: "Category slug and description cannot be empty." });
    }
    insertCategory(newCat)
    .then((category) =>{
        res.status(201).send({category});
    })
    .catch((err) => {
        next(err);
    })
}

exports.deleteCategory = (req, res, next) => {
    const {slug}  = req.params;
    removeCategory(slug).then(() => {
        res.status(204).send();
  })
  .catch((error) => {
    console.error('Error deleting category:', error);
    next(error);
    })
}

exports.patchCategory = (req, res, next) => {
    const {slug} = req.params;
    const {description} = req.body;

    if (!description) {
        return res.status(400).send({message: "Invalid description"});
    }

    return updateCategory(slug, description)
    .then((cat) => {
        res.status(200).send({cat});
    })
    .catch((error) => {
        next(error);
        })
}

exports.getEvents = (req, res, next) => {
    const {category } = req.query;
    fetchEvents(category).then((events) => {
        // console.log(events)
        res.status(200).send(events);
    })
    .catch((err) =>{
        console.log('Error getting events:', err);
        next(err);
    });
}

exports.getEventById = (req, res, next) => {
    const {event_id} = req.params;
    fetchEventById(event_id).then((event) => {
        res.status(200).send(event);
    })
    .catch((err) => {
        console.log('Error getting event:', err);
      next(err);
    });
};

exports.postEvent = (upload.single('image'), async(req, res, next) => {
    try{
        
        const newEvent = req.body;

        // If an image is uploaded, use its filename
        if (req.file) {
            newEvent.image_url = `/uploads/${req.file.filename}`;
        }

        if(!newEvent.event_name || 
            !newEvent.category || !newEvent.description || !newEvent.startdate ||
            !newEvent.starttime || 
            !newEvent.enddate ||
            !newEvent.endtime ||
            !newEvent.ticket_price || !newEvent.location 
            ){
            return res.status(422).send({ message: 'Event details (name, category, description, startdate, starttime, enddate, endtime, ticket_price, location) cannot be empty.' });
        }

        const createdEvent = await insertEvent(newEvent);
        res.status(201).json(createdEvent);
    } catch (error) {
        next(error);
    }
});

exports.deleteEvent = (req, res, next) => {
    const {event_id} = req.params;
    removeEvent(event_id).then(() =>{
        res.status(204).send();
    })
    .catch((err) => {
        console.log('Error deleting event:', err);
        next(err);
        })
};


//LOCATIONS

exports.getLocations = (req, res, next) => {
    fetchLocations()
    .then((locations) => {
        res.status(200).send(locations);
    })
    .catch((err) =>{
        next(err);
    });
}

exports.getLocationById = (req, res, next) => {
    const {location_id} = req.params;

    fetchLocationById(location_id)
    .then((location) => {
        res.status(200).send(location);
    })
    .catch((err) =>{
        next(err);
    });
}


exports.postLocation = (req, res, next) => {
    const newLocation = req.body;

    if(!newLocation.postcode || !newLocation.first_line_address ||
        !newLocation.second_line_address || !newLocation.city) {
            return res.status(422).send({message: "Location address details cannot be empty." });
    }

    insertLocation(newLocation).then((location) => {
        res.status(201).send(location);
    })
    .catch((err) => {
        console.log("Error posting Location: ", err)
        next(err);
    })
}

exports.deleteLocation = (req, res, next) => {
    const {location_id} = req.params;

    removeLocation(location_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) =>{
        console.log('Error deleting location:', err);
        next(err);
    });
}

exports.getEventGuests = (req, res, next) => {
    const {event_id}  = req.params;

    return fetchEventById(event_id)
    .then((event) => {
        if(!event) {
            return res.status(404).send({message : "Event not found."});
        } else {
            return fetchEventGuests(event_id)
        }
    }).then((guests) => {
        res.status(200).send(guests);
    })
    .catch((err) =>{
        console.log('Error getting guests:', err);
        next(err);
    });
}

// update list of attendees on event
exports.patchEventGuests = async (req, res, next) => {
    const event_id = req.params.event_id;

    try {
         // `requireAuth` has already verified the token and attached the user to `req.user`
        const user_id = req.user.id;
        if (!event_id || !user_id) {
            return res.status(400).json({ error: 'Event ID and User ID are required.' });
        }

        const guestList = await updateGuestList(event_id, user_id);
        res.status(200).json({guestList})
    }  catch(error) {
        console.error('Error updating guestList:', error);
        // Customize error messages based on the error type
        if (error.status) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

//remove Guest from event
exports.deleteEventGuest = (req, res, next) => {
    const event_id = req.params.event_id;
    const user_id = req.body.id;
    return removeGuestFromEvent(event_id, user_id)
    .then((guestList) => {
        res.status(200).send({ guestList });
    })
    .catch((error) => {
        console.error('Error removing guest:', error);
        next(error);
    });
}

// show events user signed up for 
exports.getMyEvents = async (req, res ) => {
    const user_id = req.user.id;

    try {
        const events = await fetchUserSignedUpEvents(user_id);
        res.status(200).json(events);
      } catch (error) {
        console.error('Error getting events:', error);
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
