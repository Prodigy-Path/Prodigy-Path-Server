/** @format */

const User = require('../models/user');

async function signUp(req, res, next) {
  try {
    const data = req.body;
    const newUser = await User.create(data);
    res.status(201).send(newUser);
  } catch (e) {
    next({ error: e.message });
  }
}

async function login(req, res, next) {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
}

async function getAll(req, res, next) {
  try {
    const allUsers = await User.find().all();
    res.status(200).send(allUsers);
  } catch (e) {
    next(e);
  }
}

async function getOne(req, res, next) {
  try {
    const { _id } = req.params;
    const allUsers = await User.findOne({ _id });
    if (!allUsers) res.status(404).send('Not Found!');
    res.status(200).send(allUsers);
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params._id;
    const data = req.body;

    const oneUser = await User.findById(id);
    if (!oneUser) res.status(404).send('Not Found!');
    const updatedItem = await User.findByIdAndUpdate(id, data, {
      new: true,
      overwrite: true,
    });
    res.status(200).send(updatedItem);
  } catch (e) {
    next(e);
  }
}

async function destroy(req, res, next) {
  try {
    const id = req.params._id;
    console.log(id);
    const oneUser = await User.findById(id);
    if (!oneUser) res.status(404).send('Not Found!');
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { signUp, getAll, login, getOne, update, destroy };
