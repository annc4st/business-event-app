const express = require('express');
const categoriesRouter = express.Router();
const { getCategories, postCategory, deleteCategory, patchCategory } = require('../controllers/controllers');


categoriesRouter.route('/')
.get(getCategories)
.post(postCategory);

categoriesRouter.route('/:slug')
.patch(patchCategory)
.delete(deleteCategory);

module.exports = categoriesRouter;