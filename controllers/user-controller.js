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

exports.logout = (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully'})
 
};

exports.getUser = async (req, res) => {
    console.log("request from backend ", req)

    try {
        const response = await findById(req.user.id);
        console.log("user-controller ", response)
        res.json(user);
    } catch (error) {
        console.error('Error processing request getUSer line36 : ', err);
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
