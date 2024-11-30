const express = require('express');
const eventsRouter = express.Router();
const requireAuth = require('../middlewares/authMiddleware')
const {
    getEvents, getEventById, postEvent, 
    deleteEvent, patchEventGuests,
getEventGuests, deleteEventGuest, getMyEvents
} = require('../controllers/controllers');
 


eventsRouter.route('/')
.get(getEvents)
.post(postEvent); // ? requireAuth

eventsRouter.route('/:event_id')
.get(getEventById)
.delete(deleteEvent);



eventsRouter.route('/:event_id/guests')
.get(getEventGuests)
.patch(requireAuth, patchEventGuests)
.delete(requireAuth, deleteEventGuest); 




module.exports = eventsRouter;