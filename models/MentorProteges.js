const dynamoose = require('dynamoose');

const mentorProtegeSchema = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  mentor: {
    type: String,
    required: true,
  },
  protege: {
    type: String,
    required: true,
  },
  // tags: [{
  //   type: String,
  //   required: true,
  // }],
}, {
  timestamps: true,
});

const MentorProtege = dynamoose.model('Prod-MentorProtege', mentorProtegeSchema);

module.exports = MentorProtege;
