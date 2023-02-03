const express = require('express');
const { createMessage, deleteMessage, getOneMessage, getMessages, updateMessage } = require('../controllers/messageRoute');
const messageRouter = express.Router();

messageRouter.route('/messages')
  .post(createMessage)
  .get(getMessages);

messageRouter.route('/messages/:messageId')
  .get(getOneMessage)
  .put(updateMessage)
  .delete(deleteMessage);

module.exports = messageRouter;
