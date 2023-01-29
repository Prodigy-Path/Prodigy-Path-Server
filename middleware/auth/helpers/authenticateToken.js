/** @format */

'use strict';

const Users = require('../../../models/user');
const jwt = require('jsonwebtoken');
let SECRET;
if (process.env.NODE_ENV === 'test') {
  SECRET = 'testEnvironment';
} else {
  SECRET = process.env.SECRET;
}

module.exports = async (token) => {
  try {
    console.log(token, SECRET);
    console.log(jwt.verify(token, SECRET));
    const parsedToken = jwt.verify(token, SECRET);
    console.log('PARSED');
    console.log(parsedToken);
    const user = await Users.find({ username: parsedToken.username });

    if (user) {
      return user;
    }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
};
