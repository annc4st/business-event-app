const express = require("express");
const authRouter = express.Router();

const { register, login } = require('../controllers/user-controller')

const requireAuth = require('../middlewares/authMiddleware')
const { getMyEvents } = require('../controllers/controllers');


authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.route('/my-events').get(requireAuth, getMyEvents);


module.exports = authRouter;
