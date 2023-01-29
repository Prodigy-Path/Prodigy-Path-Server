/** @format */

'use strict';

const base64 = require('base-64');
const authenticateBasic = require('./helpers/authenticateBasic');

module.exports = async (req, res, next) => {
  try {

    if (!req.headers.authorization) {
  
      return _authError();
    }

    let basic = req.headers.authorization.split(' ').pop();

    let [user, pass] = base64.decode(basic).split(':');

    req.user = await authenticateBasic(user, pass);
    if (!req.user) _authError();
    next();
  } catch (e) {
    _authError();
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }
};
