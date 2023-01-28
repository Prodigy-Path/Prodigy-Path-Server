/** @format */

const dynamoose = require('dynamoose');

const userSchema = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  role: {
    type: String,
    enum: ['mentor', 'protege'],
    required: true,
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
  token: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = dynamoose.model('Prod-User', userSchema);

module.exports = User;
