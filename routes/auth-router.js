const express = require("express");
const passport = require("passport");
const authRouter = express.Router();
// const bcrypt = require("bcrypt");
// const db = require("../db/connection");
const {ensureAuthenticated} = require('../middlewares/auth')
const { register, login, logout, getUser, getAllUsers, getUserSignedUpEvents } = require('../controllers/user-controller')


authRouter.post('/register', register);
// authRouter.post('/login', passport.authenticate('local'), login);
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

// authRouter.post("/register", async (req, res, next) => {
//   try {
//     const { username, password, email } = req.body;
//     const saltRounds = 10;
//     const hashedPsw = await bcrypt.hash(password, saltRounds);

//     const insertQuery = `INSERT INTO users (username, hashed_password,  useremail )  VALUES ($1, $2, $3) RETURNNG *;`;
//     const newUser = await db.query(insertQuery, [username, hashedPsw, email]);

//     req.login(newUser.rows[0], (err) => {
//       if (err) return next(err);
//       res.redirect("/");
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// authRouter.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

// authRouter.get('/google', passport.authenticate('google', {
//   scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
// }));

// authRouter.get('/google/redirect',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     // Successful authentication, redirect to profile.
//     // console.log("response >> ", res.req.user)
//     res.redirect('http://localhost:3000'); // Ensure the URL matches your frontend address
//   }
// );

// authRouter.get('/user', (req, res) => {
//   if (req.isAuthenticated()) {
//       res.json(req.user);
//   } else {
//       res.status(401).json({ message: 'Unauthorized' });
//   }
// });

module.exports = authRouter;
