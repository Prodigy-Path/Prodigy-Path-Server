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
    required: true,
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
});
const User = dynamoose.model('Users', userSchema);