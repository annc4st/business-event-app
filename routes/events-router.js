const express = require('express');
const eventsRouter = express.Router();
const { getEvents, getEventById} = require('../controllers/controllers');


/*
const { getArticles, getArticleById, 
    patchArticle, getCommentsForArticle, postComment, postArticle, deleteArticle
} = require('../controllers/controllers.js');

articleRouter
.route('/')
.get(getArticles)
.post(postArticle);

articleRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)
.delete(deleteArticle);

articleRouter
.route('/:article_id/comments')
.get(getCommentsForArticle)
.post(postComment);

*/

eventsRouter
.route('/')
.get(getEvents);

eventsRouter
.route('/:event_id')
.get(getEventById);


module.exports = eventsRouter;