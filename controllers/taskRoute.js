/** @format */

const Task = require('../models/tasks');

async function createTask(req, res, next) {
  try {
    const data = req.body;

    const newTask = await Task.create(data);
    res.status(201).send(newTask);
  } catch (e) {
    next(e.message);
  }
}

async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find().all();
    res.status(200).send(tasks);
  } catch (e) {
    next(e.message);
  }
}

async function getOneTask(req, res, next) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    res.status(200).send(task);
  } catch (e) {
    next(e.message);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.status(204).end();
  } catch (e) {
    next(e.message);
  }
}

async function updateTask(req, res, next) {
  try {
    const { taskId } = req.params;
    const data = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, data, {
      new: true,
      overwrite: true,
    });

    res.status(200).send(updatedTask);
  } catch (e) {
    next(e.message);
  }
}

module.exports = { createTask, deleteTask, getOneTask, getTasks, updateTask };
