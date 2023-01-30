/** @format */

const MentorProtege = require('../models/mentorProteges');

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
    const allUsers = await MentorProtege.find().all();
    res.status(200).send(allUsers);
  } catch (e) {
    next(e);
  }
}

async function getOneMentorProtege(req, res, next) {
  try {
    const { mentorProtegeId } = req.params;
    const mentorProtege = await MentorProtege.findOne({ _id: mentorProtegeId });
    res.status(200).send(mentorProtege);
  } catch (e) {
    next(e.message);
  }
}

async function deleteMentorProtege(req, res, next) {
  try {
    const id = req.params.mentorProtegeId;

    const oneUser = await MentorProtege.findById(id);
    if (!oneUser) res.status(404).send('Not Found!');
    await MentorProtege.findByIdAndDelete(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

async function updateMentorProtege(req, res, next) {
  try {
    const id = req.params.mentorProtegeId;
   
    const data = req.body;

    const oneUser = await MentorProtege.findById(id);
    if (!oneUser) res.status(404).send('Not Found!');
    const updatedItem = await MentorProtege.findByIdAndUpdate(id, data, {
      new: true,
      overwrite: true,
    });
    res.status(200).send(updatedItem);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createMentorProtege,
  deleteMentorProtege,
  getOneMentorProtege,
  getMentorProteges,
  updateMentorProtege,
};
