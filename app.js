/** @format */

const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3002;
const mongoose = require('mongoose');
require('dotenv').config();
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const taskRouter = require('./routes/taskRoutes');
const mentorProtegeRouter = require('./routes/mentorProtegeRoutes');

const cors = require('cors');
const startIo = require('./socket/server');

let DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  DATABASE_URL = process.env.DATABASE_URL_TEST;
} else {
  DATABASE_URL = process.env.DATABASE_URL_LIVE;
}

app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);
async function connectToMongoDB() {
  try {
    await console.log(`Connected to MongoDB`);
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      bufferCommands: false,
    });
  } catch (error) {
    console.error(error);
  }
}

connectToMongoDB();

app.use(mentorProtegeRouter);
app.use(taskRouter);
app.use(userRouter);
app.use(postRouter);
startIo(io);
app.all('/', (req, res, next) => {
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
