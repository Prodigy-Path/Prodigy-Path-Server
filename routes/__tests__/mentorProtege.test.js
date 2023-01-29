/** @format */

const request = require('supertest');
const { server, connectToMongoDB } = require('../../app');
const MentorProtege = require('../../models/mentorProteges');
const mongoose = require('mongoose');

let mentorProtege;

beforeAll(async () => {
  await connectToMongoDB();

  mentorProtege = new MentorProtege({
    mentor: 'mentorID',
    protege: 'protegeID',
    tags: ['JavaScript', 'C++'],
  });

  await mentorProtege.save();
});

afterAll(async () => {
  await MentorProtege.collection.drop();
  await mongoose.connection.close();
});

describe('User routes', () => {
  describe('POST /mentorproteges', () => {
    it('should create a new mentorProtege', async () => {
      const res = await request(server)
        .post('/mentorproteges')
        .send({
          mentor: 'mentorID2',
          protege: 'protegeID',
          tags: ['JavaScript', 'C++'],
        });
      expect(res.statusCode).toEqual(201);
      mentorProtege = res.body;
      expect(res.body).toHaveProperty('mentor', 'mentorID2');
      expect(res.body).toHaveProperty('protege', 'protegeID');
    });

    it('should return a 500 error if there is a database validation error', async () => {
      const res = await request(server)
        .post('/mentorproteges')
        .send({
          protege: 'protegeID',
          tags: ['JavaScript', 'C++'],
        });

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /mentorproteges', () => {
    it('should return all mentorProteges objects', async () => {
      const res = await request(server).get('/mentorproteges');
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('mentor', 'mentorID');
    });
  });

  describe('GET /mentorproteges/:id', () => {
    it('should throw a 500 error if the ID does not exist', async () => {
      const res = await request(server).get(`/mentorproteges/not-a-valid-id`);

      expect(res.statusCode).toEqual(500);
    });

    it('should retrieve one user', async () => {
      const res = await request(server).get(
        `/mentorproteges/${mentorProtege._id}`,
      );

      expect(res.statusCode).toEqual(200);
    });

    it('should throw a 404 error if the ID does not exist', async () => {
      const res = await request(server).get(`/users/5f5e7c6d8e9f0a1b2c3d4e5f`);

      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Not Found!');
    });
  });

  describe('PATCH /mentorproteges/:id', () => {
    it('should update a mentorProtege by their ID', async () => {
      console.log(mentorProtege._id);
      const res = await request(server)
        .patch(`/mentorproteges/${mentorProtege._id}`)
        .send({
          mentor: 'mentorID2',
          protege: 'changed',
          tags: ['JavaScript', 'React'],
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('protege', 'changed');
      expect(res.body).toHaveProperty('tags', ['JavaScript', 'React']);
    });

    it('should return a 404 error if the mentorProtege does not exist', async () => {
      const res = await request(server)
        .patch(`/mentorproteges/5f5e7c6d8e9f0a1b2c3d4e5f`)
        .send({
          mentor: 'mentorID2',
          tags: ['JavaScript', 'React'],
        });
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Not Found!');
    });
  });

  describe('DELETE /mentorproteges/:id', () => {
    it('should return 204 if the mentorProtege is deleted', async () => {
      const res = await request(server).delete(
        `/mentorproteges/${mentorProtege._id}`,
      );
      expect(res.statusCode).toEqual(204);
    });

    it('should return a 404 error if the mentorProtege does not exist', async () => {
      const res = await request(server).delete(
        `/mentorproteges/5f5e7c6d8e9f0a1b2c3d4e5f`,
      );
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Not Found!');
    });
  });
});
