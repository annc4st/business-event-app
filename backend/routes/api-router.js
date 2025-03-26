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

// New route to return all available API routes
apiRouter.get('/', (req, res) => {
    res.json({
      message: "List of available API routes",
      routes: [
        { method: 'GET', path: '/api/events' },
        { method: 'POST', path: '/api/events' },
        { method: 'GET', path: '/api/events/:event_id' },
        { method: 'DELETE', path: '/api/events/:event_id' },
        { method: 'GET', path: '/api/events/:event_id/guests' },
        { method: 'PATCH', path: '/api/events/:event_id/guests' },
        { method: 'DELETE', path: '/api/events/:event_id/guests' },
        { method: 'POST', path: '/api/auth/register' },
        { method: 'POST', path: '/api/auth/login' },
        { method: 'GET', path: '/api/auth/my-events' },
        { method: 'GET', path: '/api/categories' },
        { method: 'POST', path: '/api/categories' },
        { method: 'PATCH', path: '/api/categories/:slug' },
        { method: 'DELETE', path: '/api/categories/:slug' },
        { method: 'GET', path: '/api/locations' },
        { method: 'POST', path: '/api/locations' },
        { method: 'GET', path: '/api/locations/:location_id' },
        { method: 'DELETE', path: '/api/locations/:location_id' },
        { method: 'POST', path: '/api/uploads/upload' }
      ]
    });
  });


module.exports = apiRouter;