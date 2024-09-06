const express = require('express');
const eventsRouter = express.Router();
const {
    getEvents, getEventById, postEvent, 
    deleteEvent, patchEventGuests,
getEventGuests, deleteEventGuest
} = require('../controllers/controllers');


eventsRouter.route('/')
.get(getEvents)
.post(postEvent);

eventsRouter.route('/:event_id')
.get(getEventById)
.delete(deleteEvent);



eventsRouter.route('/:event_id/guests')
.get(getEventGuests)
.patch(patchEventGuests)
.delete(deleteEventGuest); ///adding guest
 


module.exports = eventsRouter;