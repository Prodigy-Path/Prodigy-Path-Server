/** @format */

'use strict';

const Users = require('../../../models/user');
const bcrypt = require('bcrypt');

module.exports = async (username, password) => {
  try {
    if (username && password) {
      const results = (await Users.find({ username: username })) || [
        { username: 'throw', password: 'error' },
      ];

      const valid = await bcrypt.compare(password, results[0]?.password);
      if (valid) {
        return results[0];
      }
    } else {
      throw new Error('Invalid User');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Invalid User');
  }
};
