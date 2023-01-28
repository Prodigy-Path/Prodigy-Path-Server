/** @format */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'process.env.SECRET';

function hashPassword(req, res, next) {
  const user = req.body;
  if (!user.password) {
    return res.status(400).send('Password is required');
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('Error hashing password');
    }
    user.password = hash;
    user.token = jwt.sign({ username: user.username }, SECRET);
    req.body = user;
    next();
  });
}

module.exports = hashPassword;
