
function ensureAuthenticated(req, res, next) {
console.log("ensureAuth >> ", req)
console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      // console.log('User authenticated:', req.user); // Log authenticated user details
      return next();
    } else {
      // console.log('from middleware Authentication failed');
      res.status(401).send('You are not authenticated');
    }
  }



module.exports = { ensureAuthenticated };