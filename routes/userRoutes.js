/** @format */

const express = require('express');
const {
  signUp,
  login,
  getAll,
  getOne,
  update,
  destroy,
} = require('../controllers/userRoute');
const hashPassword = require('../middleware/auth/hashPassword');
const basic = require('../middleware/auth/basic');
const acl = require('../middleware/auth/acl');
const userRouter = express.Router();

userRouter.route('/signup').post(hashPassword, signUp);
userRouter.route('/login').post(basic, login);
userRouter.route('/users').get(getAll);
userRouter
  .route('/users/:_id')
  .get(getOne)
  .patch(basic, acl('delete'), update)
  .delete(basic, acl('delete'), destroy);

module.exports = userRouter;
