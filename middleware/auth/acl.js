/** @format */

'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      console.log(req.user);
      if (req.user[0].capabilities.includes(capability)) {
        next();
      } else {
        res.status(403).send({ message: 'Access Denied' });
      }
    } catch (e) {
      next('Access Denied');
    }
  };
};
