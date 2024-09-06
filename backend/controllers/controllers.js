const fs = require("fs/promises");
const path = require("path");

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

exports.postEvent = (req, res, next) => {
    const newEvent = req.body;
    if(!newEvent.event_name || 
        !newEvent.category || !newEvent.description || !newEvent.startdate ||
        !newEvent.starttime || 
        !newEvent.enddate ||
        !newEvent.endtime ||
        !newEvent.ticket_price || !newEvent.location 
        ){
            return res.status(422).send({ message: 'Event details (name, category, description, startdate, starttime, enddate, endtime, ticket_price, location) cannot be empty.' });
        }
    return insertEvent(newEvent)
    .then((event) => {
        res.status(201).send({event})
    })
    .catch((error) => {
        console.log("Controller - Error posting event:", error);
        next(error);
      })
};

exports.deleteEvent = (req, res, next) => {
    const {event_id} = req.params;
    removeEvent(event_id).then(() =>{
        // console.log("log controller line 118>> ",response)
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
exports.patchEventGuests = (req, res, next) => {
    const event_id = req.params.event_id;
    const user_id = req.body.id;

    return updateGuestList(event_id, user_id)
    .then((guestList) => {
        res.status(200).send({ guestList });
    })
    .catch((error) => {
        console.error('Error updating guestList:', error);
        next(error);
        })
};

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
    console.log('getMyEvents controller hit'); // Add this line
    // if (!req.user || !req.user.id) {
    //     return res.status(401).json({ error: "User not authenticated" });
    //   }
console.log("req user >> ", req.user)
      try {
        const userId = req.user.id;
        const events = await fetchUserSignedUpEvents(userId)
        res.status(200).json(events)
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message});
      }
}
