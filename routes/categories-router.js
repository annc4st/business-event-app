const express = require('express');
const categoriesRouter = express.Router();
const { getCategories, postCategory, deleteCategory } = require('../controllers/controllers');


categoriesRouter
.route('/')
.get(getCategories)
.post(postCategory);

categoriesRouter
.route('/:slug')
.delete(deleteCategory);

module.exports = categoriesRouter;