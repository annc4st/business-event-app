const express = require('express');
const locationsRouter = express.Router();

const {
    getLocations,
    postLocation, getLocationById, deleteLocation
} = require('../controllers/controllers');

locationsRouter.route('/')
.get(getLocations)
.post(postLocation);


locationsRouter.route('/:location_id')
.get(getLocationById)
.delete(deleteLocation);


module.exports = locationsRouter;