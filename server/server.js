const express = require('express');
const WebSocket = require('ws');
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
const wss = new WebSocket.Server({ server: http });

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

// assertDatabaseConnection();

wss.on('connection', (ws, request) => {
  console.log('user connected');

  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
