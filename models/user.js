/** @format */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['mentor', 'protege'],
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      validate: (email) =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          email,
        ),
    },

    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual('token').get(function () {
  return jwt.sign({ username: this.username }, process.env.SECRET);
});

userSchema.virtual('capabilities').get(function () {
  const acl = {
    protege: ['read'],
    mentor: ['read', 'create', 'update', 'delete'],
  };
  return acl[this.role];
});

const User = mongoose.model('User', userSchema);

module.exports = User;
