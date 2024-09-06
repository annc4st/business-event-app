// const fs = require("fs/promises");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createToken}  = require('../models/util_func')



exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      hashed_password: hashedPassword,
      email,
    });

    const token = createToken(user.id);

    res.status(201).json({ username, email, token });
  } catch (error) {
    console.log("error at registering user ", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password ) {
      return res.status(400).json({ error: 'All fields are required' });
  }
  try {

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const compareResult = await bcrypt.compare(password, user.hashed_password);

    if (!compareResult) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = createToken(user.id);
    // Respond with user details and token
    res.status(200).json({ username: user.username, userID: user.id, token });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
};
