/** @format */

const express = require('express');
const http = require('http');
const PORT = 3002;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get('/', (req, res, next) => {
  res.send('Proof Of Life4');
});

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

const start = () => {
  server.listen(PORT, () => {
    console.log(`running on ${PORT}`);
  });
};

module.exports = {
  io,
  start,
};
