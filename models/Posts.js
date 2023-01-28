/** @format */

const dynamoose = require('dynamoose');

const PostSchema = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  user: {
    type: String,
    required: true,
  },
  /*  NEED TO FIX TAGS, GETTING INVALID INPUT IN RESPONSE */
  // tags: [{
  //   type: String,
  //   ref: 'Tag',
  // }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Post = dynamoose.model('Prod-Post', PostSchema);

module.exports = Post;
