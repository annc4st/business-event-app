const express = require('express');
const apiRouter = express.Router();
const eventsRouter = require('./events-router')
const categoriesRouter = require('./categories-router')
const authRouter = require('./auth-router');
const locationsRouter = require('./locations-router');
const uploadRouter = require('./upload-router');


apiRouter.use('/events', eventsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/locations', locationsRouter)
apiRouter.use('/uploads', uploadRouter)


module.exports = apiRouter;