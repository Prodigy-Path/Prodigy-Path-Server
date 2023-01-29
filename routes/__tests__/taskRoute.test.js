/** @format */
const request = require('supertest');
const { server, connectToMongoDB } = require('../../app');
const User = require('../../models/user');
const Tasks = require('../../models/tasks');
const mongoose = require('mongoose');

let user;
let user2;
beforeAll(async () => {
  await connectToMongoDB();

  user = await request(server).post('/signup').send({
    name: 'John',
    username: 'JohnSmith7',
    email: 'johnsmith@example.com',
    password: 'password',
    role: 'mentor',
  });

  user2 = await request(server).post('/signup').send({
    name: 'John2',
    username: 'JohnSmith8',
    email: 'johnsmith@example.com',
    password: 'password',
    role: 'protege',
  });
});

afterAll(async () => {
  await User.collection.drop();
  await Tasks.collection.drop();
  await mongoose.connection.close();
});

describe('TASKS /tasks', () => {
  it('should create a new task', async () => {
    const res = await request(server)
      .post('/tasks')
      .send({
        title: 'Task Title',
        description: 'Task Description',
        assigned_by: user.body._id,
        assigned_to: user2.body._id,
        completion_date: null,
        tags: ['JavaScript', 'CSS'],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Task Title');
    expect(res.body).toHaveProperty('description', 'Task Description');
  });
});

describe('GET /tasks', () => {
  it('should return an array of tasks', async () => {
    const res = await request(server).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe('GET /tasks/:taskId', () => {
  it('should return a single task', async () => {
    const tasks = await request(server).get('/tasks');

    const taskId = tasks.body[0]._id;
    const res = await request(server).get(`/tasks/${taskId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', taskId);
  });
});

describe('PUT /tasks/:taskId', () => {
  it('should update a single task', async () => {
    const tasks = await request(server).get('/tasks');

    const taskId = tasks.body[0]._id;

    const res = await request(server).put(`/tasks/${taskId}`).send({
      title: 'Updated Test Title',
      text: 'Updated Test Body',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Test Title');
    expect(res.body).toHaveProperty('_id', taskId);
  });
});

describe('DELETE /tasks/:taskId', () => {
  it('should delete a single task', async () => {
    const tasks = await request(server).get('/tasks');

    const taskId = tasks.body[0]._id;
    const res = await request(server).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toEqual(204);
  });
});
