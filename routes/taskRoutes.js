/** @format */

const express = require('express');
const { createTask, deleteTask, getOneTask, getTasks, updateTask  } = require('../controllers/taskRoute');
// const bearer = require('../middleware/auth/bearer');
const taskRouter = express.Router();


taskRouter.route('/tasks')
  .post(createTask)
  .get(getTasks);

taskRouter.route('/tasks/:taskId')
  .get(getOneTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = taskRouter;