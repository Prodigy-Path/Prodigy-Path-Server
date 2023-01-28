'use strict';

const Users = require('../../../models/User');
const bcrypt = require('bcrypt');

module.exports = async (username, password) => {
  const user = await Users.findOne({ username });
  const valid = await bcrypt.compare(password, user?.password);
  if (valid) { return user; }
  throw new Error('Invalid User');
};
