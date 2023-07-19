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
const connectedUsernames = new Set();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/', routes);

app.get('/multi', (req, res) => {
  res.sendFile(__dirname + '/public/multi.html');
});

io.on('connection', (socket) => {
  socket.on('setUsername', (username) => {
    // Check if the username is already in use
    if (connectedUsernames.has(username)) {
      // Reject the new connection with a custom error message
      socket.emit('usernameError', 'Username is already in use');
      socket.disconnect(true); // Disconnect the socket
      return;
    }

    socket.username = username;
    connectedUsernames.add(username);

    console.log(`User ${username} connected with socket ID: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    // Remove the username from the set of connected usernames
    if (socket.username) {
      connectedUsernames.delete(socket.username);
      console.log(`User ${socket.username} disconnected`);
    }
  });

  socket.on('ask question', (msg) => {
    questionsPool.push({ username: socket.username, data: msg });
    console.log(questionsPool);

    socket.join('game-room');
    if (getRoomConnections(io, 'game-room') > 1) {
      io.to('game-room').emit('players ready', questionsPool);
      io.of('/').in('game-room').socketsLeave('game-room');
      questionsPool = [];
    }
  });
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
