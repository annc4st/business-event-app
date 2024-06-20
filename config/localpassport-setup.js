const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// const db = require('../db/connection');
const { findByUsername, findById } = require('../models/user-model');
 


passport.use(new localStrategy( 
    async (username, password, cb) => {
        try{
          console.log('Authenticating user:', username);  // Add this line
            const user = await findByUsername(username)
            if(!user){
      
                return cb(null, false, {message: 'Incorrect username.'} )
            }
   
            const isMatch = await bcrypt.compare(password, user.hashed_password);

            if (!isMatch) {
              console.log('Password incorrect');  // Add this line
                return cb(null, false, { message: 'Incorrect password.' });
            }
            console.log('User authenticated successfully');  // Add this line
            return cb(null, user);
        } catch (err) {
          console.log('Error during authentication:', err);  // Add thi
          return cb(err);
        }

    }))

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
      try {
        // console.log('Deserializing user with id:', id);  // Add this 
        const user = await findById(id);
        done(null, user);
      } catch (error) {
        console.error('Error during deserialization:', error);  //
        done(error, null);
      }
    });
         

     
module.exports = passport;