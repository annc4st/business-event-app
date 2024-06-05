const express = require('express');
const apiRouter = express.Router();
const eventsRouter = require('./events-router')
const categoriesRouter = require('./categories-router')
const authRouter = require('./auth-router');
const profileRouter = require('./profile-router');


apiRouter.use('/events', eventsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/profile', profileRouter)


module.exports = apiRouter;