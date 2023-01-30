/** @format */

'use strict';

const Users = require('../../../models/user');
const jwt = require('jsonwebtoken');
let SECRET;
if (process.env.NODE_ENV === 'test') {
  SECRET = 'abcdefghikl12!';
} else {
  SECRET = process.env.SECRET;
}

module.exports = async (token) => {
  try {
    const parsedToken = jwt.verify(token, SECRET);

    const user = await Users.find({ username: parsedToken.username });

    return user;
  } catch (e) {
    throw new Error(e);
  }
};
