const fs = require("fs/promises");
const path = require("path");

const {
    fetchCategories,
    fetchEvents,
    fetchEventById

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

exports.getEvents = (req, res, next) => {
    const {category } = req.query;
    fetchEvents(category).then((events) => {
        console.log(events)
        res.status(200).send(events);
    })
    .catch((err) =>{
        next(err);
    });
}

exports.getEventById = (req, res, next) => {
    const {event_id} = req.params;
    fetchEventById(event_id).then((event) => {
        res.status(200).send(event);
    })
    .catch((error) => {
      next(error);
    });
};