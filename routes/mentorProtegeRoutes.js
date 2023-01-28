/** @format */

const express = require('express');
const { createMentorProtege, deleteMentorProtege, getOneMentorProtege, getMentorProteges, updateMentorProtege  } = require('../controllers/mentorProtegeRoute');
// const bearer = require('../middleware/auth/bearer');
const mentorProtegeRouter = express.Router();


mentorProtegeRouter.route('/mentorproteges')
  .post(createMentorProtege)
  .get(getMentorProteges);

mentorProtegeRouter.route('/mentorproteges/:mentorProtegeId')
  .get(getOneMentorProtege)
  .put(updateMentorProtege)
  .delete(deleteMentorProtege);

module.exports = mentorProtegeRouter;