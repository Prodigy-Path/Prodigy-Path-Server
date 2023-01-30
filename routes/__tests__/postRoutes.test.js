/** @format */
const request = require('supertest');
const { server, connectToMongoDB } = require('../../app');
const User = require('../../models/user');
const Posts = require('../../models/posts');
const mongoose = require('mongoose');

describe('Post routes', () => {
  beforeAll(async () => {
    await connectToMongoDB();
  });

  afterAll(async () => {
    await User.collection.drop();
    await Posts.collection.drop();
    await mongoose.connection.close();
  });
  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const user = await request(server).post('/signup').send({
        name: 'John',
        username: 'JohnSmith2',
        email: 'johnsmith@example.com',
        password: 'password',
        role: 'mentor',
      });

      const res = await request(server).post('/posts').send({
        user: user.body._id,
        text: 'test post',
        title: 'test title',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'test title');
      expect(res.body).toHaveProperty('text', 'test post');
    });
  });

  describe('GET /posts', () => {
    it('should return an array of posts', async () => {
      const res = await request(server).get('/posts');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return an array of posts', async () => {
      let res;
      try {
        res = await request(server)
          .get('/posts')
          .send({ test: 'testEnvironment' });
      } catch (e) {
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual('');
      }
    });
  });

  describe('GET /posts/:postId', () => {
    it('should return a single post', async () => {
      const posts = await request(server).get('/posts');

      const postId = posts.body[0]._id;
      const res = await request(server).get(`/posts/${postId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('_id', postId);
    });
  });

  describe('PUT /posts/:postId', () => {
    it('should update a single post', async () => {
      const posts = await request(server).get('/posts');

      const postId = posts.body[0]._id;

      const res = await request(server).put(`/posts/${postId}`).send({
        title: 'Updated Test Title',
        text: 'Updated Test Body',
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'Updated Test Title');
      expect(res.body).toHaveProperty('text', 'Updated Test Body');
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('should delete a single post', async () => {
      const posts = await request(server).get('/posts');

      const postId = posts.body[0]._id;
      const res = await request(server).delete(`/posts/${postId}`);
      expect(res.statusCode).toEqual(204);
    });
  });
});
setTimeout(() => process.exit(), 10000);
