const express = require("express");
const passport = require("passport");
const authRouter = express.Router();
const {ensureAuthenticated} = require('../middlewares/auth')
const { register, login, logout, getUser, getAllUsers, getUserSignedUpEvents } = require('../controllers/user-controller')


authRouter.post('/register', register);

authRouter.post('/logout', logout); //ensureAuthenticated, 
authRouter.get('/profile', ensureAuthenticated, getUser);
authRouter.get('/profile/events', getUserSignedUpEvents);
authRouter.get('/users', getAllUsers);
authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Error during authentication:', err); 
        return next(err);
      }
      if (!user) {
        // console.log('Authentication failed:', info); 
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error during login:', err);  
          return next(err);
        }
        return login(req, res);  // call the login controller function
      });
    })(req, res, next);
  });



module.exports = authRouter;
