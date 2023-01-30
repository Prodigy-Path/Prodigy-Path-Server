/** @format */

const request = require('supertest');
const { server, connectToMongoDB } = require('../../app');
const User = require('../../models/user');
const mongoose = require('mongoose');

let user;
let userW;
beforeAll(async () => {
  await connectToMongoDB();

  user = new User({
    name: 'John',
    username: 'JohnSmith',
    email: 'johnsmith@example.com',
    password: 'password',
    role: 'mentor',
  });
  userW = new User({
    name: 'JohnW',
    username: 'JohnSmithW',
    email: 'johnsmith@example.com',
    password: 'password',
    role: 'protege',
  });
  await user.save();
  await userW.save();
});

afterAll(async () => {
  await User.collection.drop();
  await mongoose.connection.close();
});

describe('User routes', () => {
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const res = await request(server).post('/signup').send({
        name: 'John',
        username: 'JohnSmith2',
        email: 'johnsmith@example.com',
        password: 'password',
        role: 'mentor',
      });
      expect(res.statusCode).toEqual(201);
      user = res.body;
      expect(res.body).toHaveProperty('username', 'JohnSmith2');
      expect(res.body).toHaveProperty('role', 'mentor');
    });

    it('should return a 500 error if there is a database validation error', async () => {
      const res = await request(server).post('/signup').send({
        password: 'password',
        role: 'mentor',
      });

      expect(res.statusCode).toEqual(400);
    });

    it('should return a 404 error if the path is not /signup', async () => {
      const res = await request(server).post('/sign').send({
        password: 'password',
        role: 'mentor',
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Route not found');
    });
  });

  describe('POST /login', () => {
    it('should log in a user with the correct username and password', async () => {
      const res = await request(server)
        .post('/login')
        .auth('JohnSmith2', 'password');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('username', 'JohnSmith2');
    });

    it('should return a 401 error if the password is incorrect', async () => {
      const res = await request(server)
        .post('/login')
        .auth('JohnSmith', 'incorrectpassword');
      expect(res.statusCode).toEqual(403);
      expect(res.text).toEqual('Invalid Login');
    });

    it('should return a 401 error if the username does not exist', async () => {
      const res = await request(server)
        .post('/login')
        .auth('nonexistentuser', 'password');
      expect(res.statusCode).toEqual(403);
      expect(res.text).toEqual('Invalid Login');
    });

    it('should return a 500 error if the user does not exist', async () => {
      const res = await request(server).post('/login');

      expect(res.statusCode).toEqual(403);
      expect(res.text).toEqual('Invalid Login');
    });
  });

  describe('GET /users', () => {
    it('should return a list of all users', async () => {
      const res = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${user.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('username', 'JohnSmith');
    });
  });

  describe('GET /users/:id', () => {
    it('should throw a 500 error if the ID does not exist', async () => {
      const res = await request(server)
        .get(`/users/not-a-valid-id`)
        .set('Authorization', `Bearer ${user.token}`);
      expect(res.statusCode).toEqual(500);
    });

    it('should throw a 500 error if the ID does not exist', async () => {
      const id = user.id.toString();

      const res = await request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${user.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('username', 'JohnSmith2');
    });

    it('should throw a 404 error if the ID does not exist', async () => {
      const res = await request(server)
        .get(`/users/5f5e7c6d8e9f0a1b2c3d4e5f`)
        .set('Authorization', `Bearer ${user.token}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Not Found!');
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user by their ID', async () => {
      try {
        const id = user._id.toString();

        const res = await request(server)
          .patch(`/users/${id}`)
          .set('Authorization', `Bearer ${user.token}`)
          .send({
            username: 'updatedUsername',
            role: 'testRole',
          });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'updatedUsername');
        expect(res.body).toHaveProperty('role', 'testRole');
      } catch (e) {
        console.error(e);
      }
    });

    it('should throw a 500 error if no headers are attached', async () => {
      let res;
      try {
        const id = user._id.toString();

        res = await request(server).patch(`/users/${id}`).send({
          username: 'updatedUsername',
          role: 'testRole',
        });
      } catch (e) {
        expect(res.statusCode).toEqual(500);
      }
    });

    it('should return a 404 error if the user does not exist', async () => {
      let token = await request(server)
        .post('/login')
        .auth('JohnSmith', 'password');
      const nonUser = token.body;
      const res = await request(server)
        .put(`/users/63a8afacfddbaee9aca64c72`)
        .set('Authorization', `Bearer ${nonUser.token}`)
        .send({
          username: 'notInTheDataBase',
          role: 'testRole',
        });

      expect(res.statusCode).toEqual(404);
      expect(JSON.parse(res.text).message).toEqual('Route not found');
    });
  });
  describe('DELETE /users/:id', () => {
    try {
      it('should return forbidden if the user does not have permission', async () => {
        const _id = userW._id.toString();

        const res = await request(server)
          .delete(`/users/${_id}`)
          .set('Authorization', `Bearer ${userW.token}`);
        expect(res.statusCode).toEqual(403);
      });

      it('should throw a 500 error if the token is invalid', async () => {
        const _id = userW._id.toString();

        const res = await request(server)
          .delete(`/users/${_id}`)
          .set(
            'Authorization',
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpJ9.eyJ1c2VybmFtZSI6IkpvaG5TbWl0aDciLCJpYXQiOjE2NzUwMzQ2MjR9.qh-0h9Nkp1wx8ImVfk63kGcftJ3BHEHVKHQk-C3s0vM`,
          );
        expect(res.statusCode).toEqual(500);
      });

      it('should return 204 if the user is deleted', async () => {
        const newMentor = new User({
          name: 'John',
          username: 'Delete',
          email: 'johnsmith@example.com',
          password: 'password',
          role: 'mentor',
        });
        await newMentor.save();

        const _id = newMentor._id.toString();
        const res = await request(server)
          .delete(`/users/${_id}`)
          .set('Authorization', `Bearer ${newMentor.token}`);

        expect(res.statusCode).toEqual(204);
      });
    } catch (e) {
      console.error(e);
    }
  });
});
