const express = require('express');
const WebSocket = require('ws');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const setCookie = require('set-cookie-parser');
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
const wss = new WebSocket.Server({ noServer: true });

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

const authenticate = (request, callback) => {
  const cookies = setCookie(request.headers.cookie);
  const token = cookies[0].token;
  if (!token) {
    callback(new Error('Authorization Failed'));
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    request.userId = verified.id;
  } catch(error)  {
    callback(new Error(error));
    return;
  }
  callback();
}

http.on('upgrade', function upgrade(request, socket, head) {
  authenticate(request, (err) => {
    if (err) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws, request) => {
  console.log('user connected');

  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })

  ws.on('close', () => {
    console.log('user disconnected');
  })
})

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
