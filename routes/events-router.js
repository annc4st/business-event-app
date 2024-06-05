const express = require('express');
const eventsRouter = express.Router();
const {
    getEvents, getEventById, postEvent, 
    deleteEvent, 
    patchEvent 
} = require('../controllers/controllers');


eventsRouter.route('/')
.get(getEvents)
.post(postEvent);

eventsRouter.route('/:event_id')
.get(getEventById)
.delete(deleteEvent)
.patch(patchEvent);


module.exports = eventsRouter;