const fs = require("fs/promises");

const {findByUsername, findById, createUser, fetchAllUsers, fetchUserSignedUpEvents} = require('../models/user-model');

exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const newUser = await createUser(username, password, email, role);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.log("error at registerign user ", error)
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.login = (req, res) => {
    const { id, username, email, role } = req.user; // Extracting only the required fields
  res.status(200).send({
    message: 'Logged in successfully',
    user: { id, username, email, role }
  });
};

exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid'); // Ensure you clear the session cookie
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
};

exports.getUser = async (req, res) => {
    
    try {
        const response = await findById(req.user.id);
        res.status(200).send(response);
    } catch (error) {
        console.error('Error processing request getUSer line36 : ', error);
        res.status(500).send({ error: 'Failed to fetch user' });
    }
};

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((users) => {
        res.status(200).send(users);
    })
    .catch((err) =>{
        next(err);
    });
}

exports.getUserSignedUpEvents = (req, res, next) => {
    const userId = req.user.id; 
    fetchUserSignedUpEvents(userId)
    .then((usersEvents) => {
        res.status(200).send(usersEvents)
    })
    .catch((err) =>{
        next(err);
    })
}
