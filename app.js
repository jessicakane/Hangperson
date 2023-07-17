const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { getRoomConnections } = require('./multi-utils');

const routes = require('./routes');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

let questionsPool = [];

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/', routes);

app.get('/multi', (req, res) => {
  res.sendFile(__dirname + '/public/multi.html');
});

io.on('connection', (socket) => {
  socket.on('setUsername', (username) => {
    socket.username = username;

    console.log(`User ${username} connected with socket ID: ${socket.id}`);
  });

  socket.on('ask question', (msg) => {
    questionsPool.push({ username: socket.username, data: msg });
    console.log(questionsPool);

    socket.join('game-room');
    if (getRoomConnections(io, 'game-room') > 1) {
      io.to('game-room').emit('players ready', questionsPool);
      io.of('/').in('game-room').socketsLeave('game-room');
    }
  });

  // socket.on('accept question', (msg) => (questionsPool = []));
});

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.nr4unvw.mongodb.net/hangperson?retryWrites=true&w=majority`
    );
    server.listen(process.env.PORT || 3000, () => {
      console.log('Server started on port ' + (process.env.PORT || 3000));
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
