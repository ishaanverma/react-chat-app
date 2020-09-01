const express = require('express');
const { isAuthenticated } = require('./isAuth');
const { models } = require('../models');

const router = express.Router();

router.post('/create', isAuthenticated, async (req, res) => {
  const { name, members, public } = req.body;
  const chat = models.Chat.build({
    name: name,
    public: public,
  });
  const userIds = members.map((item) => item.id);
  userIds.push(req.userId);
  // console.log(chat.toJSON());
  try {
    await chat.save();
    await chat.addUsers(userIds);
  } catch(error)  {
    return res.status(400).send(error.errors[0].message);
  }
  return res.send({ "chat": chat.id });
});

router.get('/all', isAuthenticated, async (req, res) => {
  const user = await models.User.findOne({
    where: {
      id: req.userId
    }
  })
  const chats = await user.getChats({
    attributes: [["id", "chatId"], "name"],
    joinTableAttributes: []
  });

  res.status(200).send(chats);
});

module.exports = router;