const express = require('express');
const profileRouter = express.Router();
const {ensureAuthenticated } = require('../middlewares/auth');

profileRouter.get('/', ensureAuthenticated, (req, res) => {
    res.send(req.user);
})

module.exports = profileRouter;