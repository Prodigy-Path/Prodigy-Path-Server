/** @format */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completion_date: {
    type: Date,
    default: null,
    required: false,
    allowNull: true,
  },
  tags: [
    {
      type: String,
    },
  ],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
