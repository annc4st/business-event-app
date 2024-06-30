
function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
      // console.log('User authenticated:', req.user); // Log authenticated user details
      return next();
    } else {
      // console.log('from middleware Authentication failed');
      res.status(401).send('You are not authenticated');
    }
  }



module.exports = { ensureAuthenticated };