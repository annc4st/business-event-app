require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });

const express = require('express');
const cors = require('cors');
// const cookieSession = require('cookie-session');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router'); 

require('./config/localpassport-setup');

const app = express();

if (process.env.NODE_ENV === 'production') {
  
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true // Depending on the redis version
  });

  redisClient.connect().catch(console.error);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    expires: 1000 * 60 * 60 *24 
  } //  
}));
} else {
  app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false
  }));
}


// app.use(cookieSession({
//   name: 'session',
//   keys: [process.env.COOKIE_KEY],
//   maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   secure: process.env.NODE_ENV === 'production', 
// }));

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

// app.use(expressSession({
//     secret: process.env.COOKIE_KEY,
//     resave: false,
//     saveUninitialized: false
// }));


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
