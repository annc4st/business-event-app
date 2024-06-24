require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });

const express = require('express');
const cors = require('cors');

const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router'); 

require('./config/localpassport-setup');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

 
const allowedOrigins = [
  'http://localhost:3000',
  'https://business-event-app.netlify.app', 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// middleware to set headers explicitly (optional, for completeness)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
 

// more middleware
app.use(bodyParser.json());

app.use(expressSession({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api', apiRouter);


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


module.exports = app;
