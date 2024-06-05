const express = require('express');
const passport = require('passport');
const authRouter = express.Router();


authRouter.get('/login', (req, res) => {
  res.send('Login Page');
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('api/profile');
});

module.exports = authRouter;

