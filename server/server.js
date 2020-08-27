const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', (data) => {
    console.log(data);
    io.emit('message', data);
  });
});

http.listen(PORT, () =>  {
  console.log(`Listening on http://localhost:${PORT}`);
});
