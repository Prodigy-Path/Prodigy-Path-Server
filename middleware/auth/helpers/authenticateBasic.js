/** @format */

'use strict';

const Users = require('../../../models/User');
const bcrypt = require('bcrypt');

module.exports = async (username, password) => {
  try {
    console.log('line10');
    const results = await Users.scan({ username: username }).exec();
    const user = results[0];
    console.log(user, 'FLAG IN USER');
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
  } catch (e) {
    console.log(e);
    throw new Error('Invalid User');
  }
};
