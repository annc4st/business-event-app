
const jwt = require('jsonwebtoken')
const User = require('../models/User')


const requireAuth = async (req, res, next) => {
  console.log('Auth middleware hit');
  const { authorization } = req.headers;

  if (!authorization){
    return res.status(401).json({error: 'Authorization token is required'})
  }
  //get token from authorization "Bearer lskjfslfks098sfs.slkjhfw.oisfjosd"
  const token = authorization.split(' ')[1]
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const {id} = jwt.verify(token, process.env.SECRET)
    console.log("Token verified, user ID:", id);
    req.user = await User.findByPk(id);

    if (!req.user) {
      console.log("Not found user by id")
      return res.status(401).json({ error: 'User not found' });
    } else {
      console.log("found user by id", req.user.id)
    }

  /// Proceed to next middleware/route handler
  next()

  } catch(error) {
    console.log("Error verifying token:", error);
    console.error('Authentication error:', error);
    res.status(401).json({error: 'Request is not authorized'})
  }
}


module.exports = requireAuth;

// const ensureAuthenticated = async (req, res, next) => {
//   const token = req.cookie.jwt;

//   //check jwt exists
//   if(token) {
//     jwt.verify(token, process.env.SECRET, (error, decodedToken) => {
//       if (error){
//         console.log(error.message)
//         //redirect login in ejs but here smth else
//       } else {
//         console.log(decodedToken)
//         next();
//     }
//     })
//   } else {
//     //redirect login in ejs but here smth else
//   }
// }

// // check current user to insert into views his email

// const checkUser = (req, res, next) => {
//   const token = req.cookie.jwt;

//   if(token) {
//     jwt.verify(token, process.env.SECRET, async (error, decodedTOken) => {
//       if (error){
//         console.log(error.message)
//         //in ejs => res.locals.user = null;
//         user = null; // ???? res.status(401).send('You are not authenticated');
//         next();
//       } else {
//         console.log("decoded token >> ", decodedTOken)
//         //let userFromToken = await User.findById(decodedToken.id)
//         let userFromToken = await db.query('SELECT * FROM users WHERE id = $1', [decodedTOken.id]);
//         // in ejs  res.locals.user = userFromToken; // injected data to the view if user logged in

//       }
//     })
//   } else {
   
//     next();
//   }

// }

// module.exports = { ensureAuthenticated, checkUser }