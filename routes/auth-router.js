const express = require("express");
const passport = require("passport");
const authRouter = express.Router();
const {ensureAuthenticated} = require('../middlewares/auth')
const { register, login, logout, getUser, getAllUsers, getUserSignedUpEvents } = require('../controllers/user-controller')


authRouter.post('/register', register);

authRouter.post('/logout', ensureAuthenticated, logout);
authRouter.get('/profile', ensureAuthenticated, getUser);
authRouter.get('/profile/events', ensureAuthenticated, getUserSignedUpEvents);
authRouter.get('/users', getAllUsers);
authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Error during authentication:', err);  // Add this line
        return next(err);
      }
      if (!user) {
        console.log('Authentication failed:', info);  // Add this line
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error during login:', err);  // Add this line
          return next(err);
        }
        return login(req, res);  // Call the login controller function
      });
    })(req, res, next);
  });



module.exports = authRouter;
