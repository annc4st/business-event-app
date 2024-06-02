const express = require('express');
const apiRouter = express.Router();
// const endpointRouter = require('./endpoint-router')
const eventsRouter = require('./events-router')
// const commentRouter = require('./comment-router')
const categoriesRouter = require('./categories-router')
const authRouter = require('./auth-router')
 

// apiRouter.use('/', endpointRouter)
// apiRouter.use('/comments', commentRouter)
apiRouter.use('/events', eventsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/auth', authRouter)



module.exports = apiRouter;