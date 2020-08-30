const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const cookie = require('cookie');
const sequelize = require('./models');
const usersPath = require('./routes/users');
const authPath = require('./routes/auth');

const PORT = process.env.PORT || 5000;
const app = express();

// setup middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
app.use('/users', usersPath);
app.use('/auth', authPath);
dotenv.config();

const http = require('http').createServer(app);
const io = require('socket.io')(http)
const id_to_socket = new Map();

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

assertDatabaseConnection();

io.use((socket, next) => {
  let cookies = socket.request.headers.cookie;
  cookies = cookie.parse(cookies);
  const token = cookies.token;
  if (!token) {
    next(new Error('Authorization Failed'));
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    socket.userId = verified.user_id;
    // console.log(verified);
  } catch(error)  {
    next(new Error('Authorization Failed'));
    return;
  }
  next();
});

io.on('connection', socket => {
  console.log('user connected');
  id_to_socket[socket.userId] = socket.id;

  socket.on('message', data => {
    data = JSON.parse(data);
    console.log(data.message);
    socket.broadcast.emit('message', data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
