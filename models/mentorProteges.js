/** @format */

const mongoose = require('mongoose');

const mentorProtegeSchema = new mongoose.Schema(
  {
    mentor: {
      type: String,
      required: true,
    },
    protege: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const MentorProtege = mongoose.model('MentorProtege', mentorProtegeSchema);

module.exports = MentorProtege;
