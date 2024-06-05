require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });
const passport = require('passport');
// const db = require('./connection');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const User = require('../models/user-model');
const sequelize = require('../sequelize'); // Import Sequelize instance
const db = require('../db/connection');

// serialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = userResult.rows[0];
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


passport.use(new GoogleStrategy({
    //  options for strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] // Request scopes
    }, async(accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
        // Check if user already exists
        // let existingUser = await User.findOne({ where: { googleId: profile.id } });
        const userResult = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        const existingUser = userResult.rows[0];
        

        if (existingUser) {
            return done(null, existingUser);
        } else {
            // If user doesn't exist, create a new user 
            //sequelize method
            // let newUser = await User.create({
            //     googleId: profile.id,
            //     username: profile.displayName,
            //     email: profile.emails[0].value, // Email is available here
            //     thumbnail: profile.photos[0].value
            // });
            const newUserResult = await db.query(
                `INSERT INTO users (google_id, username, email, thumbnail) VALUES ($1, $2, $3, $4) RETURNING *`,
                [profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value]
            );
            const newUser = newUserResult.rows[0];
            return done(null, newUser);
        }
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;
  
//         if (existingUser.rows.length > 0) {
//           done(null, existingUser.rows[0]);
//         } else {
//           // Create new user
//           const newUser = await db.query(`
//             INSERT INTO users (google_id, username, email, role, thumbnail)
//             VALUES ($1, $2, $3, 'user', $4)
//             RETURNING *;
//           `, [profile.id, profile.displayName, profile.emails[0].value, profile._json.picture]);
  
//           done(null, newUser.rows[0]);
//         }
//       } catch (error) {
//         done(error, null);
//       }
//     })
//   );
  
        //example with mongo db
        
//         ).then((currentUser) => {
//             if (currentUser) {
//                 // console.log('User is' + currentUser);
//                 // do something
//                 done(null, currentUser);
//             } else{
//                     // if not - create user in our db
//                 new User({
//                     googleId: profile.id,
//                     username: profile.displayName,
//                    //??? thumbnail: profile._json.picture
//                 }).save().then((newUser) => {
//                     console.log('created new user: ' + newUser);
//                     //do smth
//                     done(null, newUser);
//                 });
//             }
//         });
//     })
// );
