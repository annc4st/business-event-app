const express = require('express');
const categoriesRouter = express.Router();
const { getCategories } = require('../controllers/controllers');





categoriesRouter
.route('/')
.get(getCategories);

module.exports = categoriesRouter;