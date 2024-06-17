const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).send('You are not authenticated');
    }
  }


const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    console.log('No Authorization header found');
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Invalid Token:', err);
    res.status(400).send('Invalid Token');
  }
};
  
module.exports = { ensureAuthenticated, verifyToken };