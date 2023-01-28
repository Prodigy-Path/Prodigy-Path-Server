/** @format */

const Post = require('../models/posts');

async function createPost(req, res, next) {
  try {
    const data = req.body;
    const newPost = await Post.create(data);
    res.status(201).send(newPost);
  } catch (e) {
    next(e.message);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await Post.scan().exec();
    res.status(200).send(posts);
  } catch (e) {
    next(e.message);
  }
}

async function getOnePost(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await Post.get({ _id: postId });
    res.status(200).send(post);
  } catch (e) {
    next(e.message);
  }
}


async function deletePost(req, res, next) {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.delete({ _id: postId });
    res.status(200).send(deletedPost, 'Post deleted successfully');
  } catch (e) {
    next(e.message);
  }
}

async function updatePost(req, res, next) {
  try {
    const { postId } = req.params;
    const data = req.body;
    const updatedPost = await Post.update({ _id: postId }, data);
    res.status(200).send(updatedPost);
  } catch (e) {
    next(e.message);
  }
}



module.exports = { createPost,deletePost, getOnePost, getPosts,  updatePost };
