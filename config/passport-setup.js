// require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });
// const passport = require('passport');

// // const GoogleStrategy = require('passport-google-oauth20').Strategy; 

// const db = require('../db/connection');

// // serialize
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
//         const user = userResult.rows[0];
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });


// passport.use(new GoogleStrategy({
//     //  options for strategy
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/api/auth/google/redirect',
//     scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] // Request scopes
//     }, async(accessToken, refreshToken, profile, done) => {
//     console.log(profile);
//     try {
//         // Check if user already exists
  
//         const userResult = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
//         const existingUser = userResult.rows[0];
        

//         if (existingUser) {
//             return done(null, existingUser);
//         } else {
//             // If user doesn't exist, create a new user 
          
//             const newUserResult = await db.query(
//                 `INSERT INTO users (google_id, username, email, thumbnail) VALUES ($1, $2, $3, $4) RETURNING *`,
//                 [profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value]
//             );
//             const newUser = newUserResult.rows[0];
//             return done(null, newUser);
//         }
//     } catch (error) {
//         return done(error, false);
//     }
// }));

// module.exports = passport;
 