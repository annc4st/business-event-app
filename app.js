// require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });

const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
const cookieSession = require('cookie-session');
// const expressSession = require('express-session'); // changed from cookie-session
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router'); 
const authRouter = require('./routes/auth-router');

require('./config/passport-setup');
const keys = require('./config/keys');

const multer = require('multer');


const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware
app.use(bodyParser.json());
app.use(cookieSession({
  maxAge : 24 *60 *60 * 1000,
  keys : [keys.session.cookieKey]
}));
//or
// app.use(expressSession({
//     secret: keys.session.cookieKey,
//     resave: false,
//     saveUninitialized: false
// }));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);


app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})  //to change to Bad Request
  })

//Error handling

app.use((error, req, res, next) => {
  if (error.code === '22P02') {
    res.status(400).send({ message: 'Invalid input syntax'})
  }

  if (error.status && error.message) {
    res.status(error.status).send({ message: error.message });
  } 
    else {
    res.status(500).send({ message: 'Internal server error' });
  }
  });

// Synchronize models and start the server
// sequelize.sync().then(() => {
//   console.log('Database & tables created!');
//   app.listen(9001, () => {
//     console.log('Server is running on port 9000');
//   });
// }).catch(err => console.error('Error synchronizing database:', err));

module.exports = app;