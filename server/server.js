const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./models');

const PORT = process.env.PORT || 5000;
const app = express();

// setup middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) =>  {
  res.send('Hello World');
});

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

io.on('connection', (socket) => {
  let addedUser = false;
  console.log('user connected');

  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('message', {
      username: data.username,
      message: data.message
    });
  });

  // when client emits add user, execute this
  // socket.on('add user', (username) => {
  //   console.log(username);
  //   if (addedUser) return;

  //   // store username in socket session
  //   socket.username = username.id;
  //   addedUser = true;

  //   socket.broadcast.emit('user joined', {
  //     username: socket.username,
  //   });
  // });

  // when client emits typing, broadcast it
  // socket.on('typing', () => {
  //   socket.broadcast.emit('typing', {
  //     username: socket.username,
  //   });
  // });

  // // when client emits stop typing, broadcast it
  // socket.on('stop typing', () => {
  //   socket.broadcast.emit('stop typing', {
  //     username: socket.username,
  //   });
  // });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
