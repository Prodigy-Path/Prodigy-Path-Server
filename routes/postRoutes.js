/** @format */

const express = require('express');
const { createPost, deletePost, getOnePost, getPosts, updatePost  } = require('../controllers/postRoute');
// const bearer = require('../middleware/auth/bearer');
const postRouter = express.Router();


postRouter.route('/posts')
  .post(createPost)
  .get(getPosts);

postRouter.route('/posts/:postId')
  .get(getOnePost)
  .put(updatePost)
  .delete(deletePost);

module.exports = postRouter;