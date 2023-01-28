/** @format */

const MentorProtege = require('../models/MentorProteges');

async function createMentorProtege(req, res, next) {
  try {
    const data = req.body;
    const newMentorProtege = await MentorProtege.create(data);
    res.status(201).send(newMentorProtege);
  } catch (e) {
    next(e.message);
  }
}

async function getMentorProteges(req, res, next) {
  try {
    const mentorProtege = await MentorProtege.scan().exec();
    res.status(200).send(mentorProtege);
  } catch (e) {
    next(e.message);
  }
}

async function getOneMentorProtege(req, res, next) {
  try {
    const { mentorProtegeId } = req.params;
    const mentorProtege = await MentorProtege.get({ _id: mentorProtegeId });
    res.status(200).send(mentorProtege);
  } catch (e) {
    next(e.message);
  }
}


async function deleteMentorProtege(req, res, next) {
  try {
    const { mentorProtegeId } = req.params;
    const deletedMentorProtege = await MentorProtege.delete({ _id: mentorProtegeId });
    res.status(200).send(deletedMentorProtege, 'MentorProtege deleted successfully');
  } catch (e) {
    next(e.message);
  }
}

async function updateMentorProtege(req, res, next) {
  try {
    const { mentorProtegeId } = req.params;
    const data = req.body;
    const updatedMentorProtege = await MentorProtege.update({ _id: mentorProtegeId }, data);
    res.status(200).send(updatedMentorProtege);
  } catch (e) {
    next(e.message);
  }
}



module.exports = { createMentorProtege,deleteMentorProtege, getOneMentorProtege, getMentorProteges,  updateMentorProtege };
