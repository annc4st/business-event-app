const express = require('express');
const profileRouter = express.Router();
const requireAuth  = require('../middlewares/authMiddleware');
const {getMyEvents} = require('../controllers/controllers')

// Middleware for authentication
// profileRouter.use(requireAuth);

profileRouter.get('/', requireAuth, getMyEvents);

module.exports = profileRouter;