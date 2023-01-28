/** @format */

const express = require('express');
const { signUp } = require('../controllers/userRoute');
const hashPassword = require('../middleware/auth/hashPassword');
const userRouter = express.Router();

userRouter.route('/signup').post(hashPassword, signUp);

module.exports = userRouter;
