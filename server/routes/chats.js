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

  // save chat and chat members to database
  try {
    await chat.save();
    await chat.addUsers(userIds);
  } catch(error)  {
    return res.status(400).send(error.errors[0].message);
  }

  // get mapping of userId to socket id 
  const id_to_socket = res.app.get('id_to_socket');
  // get socket ids of online users
  const socket_ids = userIds.filter(item => {
    if (!id_to_socket.get(item)) return false;
    return true;
  }).map(item => id_to_socket.get(item));

  // broadcast 'chat joined' to all online users belonging to chat
  socket_ids.map(id => { res.app.get('socketio').sockets.connected[id].join(chat.id) });
  res.app.get('socketio').to(chat.id).emit('chat joined', { 
    "chatId": chat.id,
    "name": chat.name
  });
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

router.get('/members/:chatId', isAuthenticated, async (req, res) => {
  // TODO check if req.userId is in the requested chat
  const chatId = req.params.chatId;
  const chats = await models.Chat.findOne({
    where: {
      id: chatId,
    },
  });
  const users = await chats.getUsers({
    attributes: [["id", "UserId"], "name"],
    joinTableAttributes: ["ChatId"]
  });

  res.status(200).send(users);
});

module.exports = router;