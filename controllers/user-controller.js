const fs = require("fs/promises");

const {findByUsername, findById, createUser, fetchAllUsers} = require('../models/user-model');

exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const newUser = await createUser(username, password, email, role);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.login = (req, res) => {
    console.log('Login controller invoked');  // Add this line
    console.log('Authenticated user:', req.user);  // Add this line
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

    try {
        const user = await findById(req.user.id);
        res.json(user);
    } catch (error) {
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
