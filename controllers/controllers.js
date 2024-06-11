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
    updateEvent,
    fetchLocations,
    fetchLocationById,
    insertLocation, removeLocation,
    fetchEventGuests,

        } = require("../models/models.js");

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
        console.error('Error getting events:', err);
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
        !newEvent.category || !newEvent.description || !newEvent.date ||
        !newEvent.time || !newEvent.ticket_price || !newEvent.location 
        ){
            return res.status(422).send({ message: 'Event details (name, category, description, date, time, ticket_price, location) cannot be empty.' });
        }
    return insertEvent(newEvent)
    .then((event) => {
        res.status(201).send({event})
    })
    .catch((error) => {
        console.error("Controller - Error posting event:", error);
        next(error);
      })
};

exports.deleteEvent = (req, res, next) => {
    const {event_id} = req.params;
    removeEvent(event_id).then(() =>{
        res.status(204).send();
    })
    .catch((err) => {
        console.error('Error deleting event:', err);
        next(err);
        })
};
// update list of attendees on event
exports.patchEvent = (req, res, next) => {
    const event_id = req.params.event_id;
    const user_id = req.body.id;

    return updateEvent(event_id, user_id)
    .then((event) => {
        res.status(200).send({event});
    })
    .catch((error) => {
        console.error('Error patching event:', error);
        next(error);
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
    .then((location) => {
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

