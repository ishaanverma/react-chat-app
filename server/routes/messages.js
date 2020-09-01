const express = require('express');
const { isAuthenticated } = require('./isAuth');
const { models } = require('../models');

const router = express.Router();

router.post('/all', isAuthenticated, async(req, res) => {
  const { chatId } = req.body;

  // check if user is part of the chat
  const user = await models.User.findOne({
    where: {
      id: req.userId
    }
  })
  const chat = await user.getChats({
    where: {
      id: chatId
    }
  });
  if (chat.length === 0) return res.status(404).send("Chat not found");

  // fetch messages belonging to the chat
  const messages = await models.Message.findAll({
    where: {
      ChatId: chat[0].dataValues.id
    },
    include: [{ 
      model: models.User,
      attributes: ['name'],
    }],
    attributes: ['type', 'content', 'createdAt', 'ChatId'],
  })
  res.status(200).send(messages);
});

module.exports = router;