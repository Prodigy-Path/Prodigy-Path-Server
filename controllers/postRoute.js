/** @format */

const Post = require('../models/posts');

async function createPost(req, res, next) {
  try {
    const data = req.body;

    const newPost = await Post.create(data);

    res.status(201).send(newPost);
  } catch (e) {
    console.error(e.message);
    next(e.message);
  }
}

async function getPosts(req, res, next) {
  try {
    if (req.body) {
      if (req.body.test === 'testEnvironment') {
        throw new Error('test');
      }
    }
    const posts = await Post.find().all();
    res.status(200).send(posts);
  } catch (e) {
    next(e);
  }
}

async function getOnePost(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await Post.find({ _id: postId });
    res.status(200).send(post);
  } catch (e) {
    console.error(e.message);
    next(e);
  }
}

async function deletePost(req, res, next) {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(204).end();
  } catch (e) {
    next(e.message);
  }
}

async function updatePost(req, res, next) {
  try {
    const { postId } = req.params;

    const data = req.body;

    const updatedPost = await Post.findById(postId);
    if (!updatedPost) res.status(404).send('Not Found!');
    const updatedItem = await Post.findByIdAndUpdate(postId, data, {
      new: true,
      overwrite: true,
    });
    res.status(200).send(updatedItem);
  } catch (e) {
    next(e);
  }
}

module.exports = { createPost, deletePost, getOnePost, getPosts, updatePost };
