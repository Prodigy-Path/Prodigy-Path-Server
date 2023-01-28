/** @format */

const User = require('../models/User');

async function signUp(req, res, next) {
  try {
    const data = req.body;
    const newUser = await User.create(data);
    res.status(201).send(newUser);
  } catch (e) {
    next(e.message);
  }
}

async function login(req, res, next) {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (e) {
    next(e.message);
  }
}

module.exports = { signUp, login };
