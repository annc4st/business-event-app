const express = require('express');
const passport = require('passport');
const authRouter = express.Router();

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

authRouter.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to profile.
    // console.log("response >> ", res.req.user)
    res.redirect('http://localhost:3000'); // Ensure the URL matches your frontend address
  }
);

authRouter.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
      res.json(req.user);
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
});


module.exports = authRouter;

