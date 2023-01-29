/** @format */

'use strict';

const authenticateToken = require('./helpers/authenticateToken');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      _authError();
    }

    const token = req.headers.authorization.split(' ').pop();

    const validUser = await authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;

    next();
  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
};
