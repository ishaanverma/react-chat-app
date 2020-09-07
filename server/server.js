const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./models');
const usersPath = require('./routes/users');
const authPath = require('./routes/auth');
const chatPath = require('./routes/chats');
const messagePath = require('./routes/messages');

const PORT = process.env.PORT || 5000;
const app = express();

// setup middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/users', usersPath);
app.use('/auth', authPath);
app.use('/chats', chatPath);
app.use('/messages', messagePath);
dotenv.config();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const id_to_socket = new Map();

app.set('socketio', io);
app.set('id_to_socket', id_to_socket);

async function assertDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch (error) {
    console.log('Connection to Db Failed:');
    console.log(error.message);
  }
  // sequelize.sync();
}
// establish connection to database
assertDatabaseConnection();

// authenticate user when establishing web socket
io.use(wrap(cookieParser()));
io.use((socket, next) => {
  const token = socket.request.cookies.token;
  if (!token) {
    return next(new Error('Authentication Failed'));
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET || 'secret');
    socket.userId = verified.user_id;
  } catch(error)  {
    return next(new Error('Authentication Failed'));
  }
  next();
});

io.on('connection', async (socket) => {
  console.log('user connected');
  id_to_socket.set(socket.userId, socket.id);

  // get chats belonging to a user
  const chats = await sequelize.models.UserChats.findAll({
    where: {
      UserId: socket.userId
    },
    attributes: ['ChatId']
  });
  // when user comes online, join the chat
  const chatIds = chats.map((item) => item.dataValues.ChatId.toString());
  socket.join(chatIds);

  socket.on('message', async (data) => {
    data = JSON.parse(data);
    // console.log(data);
    // TODO: validate message
    // TODO: get createdAt from client?
    await sequelize.models.Message.create({
      type: 'text',
      content: data.content,
      UserId: socket.userId,
      ChatId: data.chatId
    });
    socket.to(data.chatId).emit('message', data);
  });

  socket.on('start typing', (data) => {
    socket.to(data.chatId).emit('start typing', data);
  });

  socket.on('stop typing', (data) => {
    socket.to(data.chatId).emit('stop typing', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    id_to_socket.delete(socket.userId);
  });
})

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
