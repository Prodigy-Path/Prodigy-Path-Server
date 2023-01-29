/** @format */

const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const socketio = require('socket.io');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const userRouter = require('./routes/userRoutes');
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


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  console.log(req);
  res.send(JSON.stringify(req.oidc.user));
});



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
// app.use(userRouter);
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
  connectToMongoDB,
  server,
};
