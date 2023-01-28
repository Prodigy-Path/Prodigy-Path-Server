const express = require('express');
const { signUp } = require('../controllers/userRoute');

const userRouter = express.Router();



userRouter.route('/signup')
  .post(signUp);

module.exports = userRouter;