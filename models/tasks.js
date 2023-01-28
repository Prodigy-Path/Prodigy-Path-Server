/** @format */

const dynamoose = require('dynamoose');

const taskSchema = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  assigned_by: {
    type: String,
    required: true,
    ref: 'Prod-User',
  },
  assigned_to: {
    type: String,
    required: true,
    ref: 'Prod-User',
  },
  /*  NEED TO FIX TAGS AS WELL AS COMP DATE, GETTING INVALID INPUT IN RESPONSE */
  completion_date: {
    type: Date,
    default: null,
    required: false,
    allowNull: true,
  },
  tags: {
    type: Array,
    schema: [String],
  },
});

const Task = dynamoose.model('Prod-Task', taskSchema);

module.exports = Task;
