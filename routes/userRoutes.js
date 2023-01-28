/** @format */

const express = require('express');
const { signUp, login } = require('../controllers/userRoute');
const hashPassword = require('../middleware/auth/hashPassword');
const basic = require('../middleware/auth/basic');
const userRouter = express.Router();

userRouter.route('/signup').post(hashPassword, signUp);
userRouter
  .route('/login')
  .post(basic, login)
  .put(() => console.log('put request'))
  .delete(() => console.log('delete'));
module.exports = userRouter;
