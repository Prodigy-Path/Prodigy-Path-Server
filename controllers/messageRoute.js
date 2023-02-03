/** @format */

const Message = require('../models/message');

async function createMessage(req, res, next) {
  try {
    const data = req.body;

    const newMessage = await Message.create(data);

    res.status(201).send(newMessage);

  } catch (e) {
    console.error(e.message);
    next(e);
  }
}

async function getMessages(req, res, next) {
  try {
    if (req.body) {
      if (req.body.test === 'testEnvironment') {
        throw new Error('test');
      }
    }
    const messages = await Message.find().all();
    res.status(200).send(messages);
  } catch (e) {
    next(e);
  }
}

async function getOneMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const message = await Message.find({ _id: messageId });
    res.status(200).send(message);
  } catch (e) {
    console.error(e.message);
    next(e);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}

async function updateMessage(req, res, next) {
  try {
    const { messageId } = req.params;

    const data = req.body;

    const updatedMessage = await Message.findById(messageId);
    if (!updatedMessage) res.status(404).send('Not Found!');
    const updatedItem = await Message.findByIdAndUpdate(messageId, data, {
      new: true,
      overwrite: true,
    });
    res.status(200).send(updatedItem);

  } catch (e) {
    next(e);
  }
}

module.exports = { createMessage, deleteMessage, getOneMessage, getMessages, updateMessage };