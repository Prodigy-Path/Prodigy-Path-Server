/** @format */

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

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

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
