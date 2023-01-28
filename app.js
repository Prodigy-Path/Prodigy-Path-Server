/** @format */

const dynamoose = require('dynamoose');
const express = require('express');
const http = require('http');
const PORT = 3002;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const taskRouter = require('./routes/taskRoutes');
const mentorProtegeRouter = require('./routes/mentorProtegeRoutes');

require('dotenv').config();






const  ddb = new dynamoose.aws.ddb.DynamoDB({
  region: 'us-east-2',
  accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
  secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
});

dynamoose.aws.ddb.set(ddb);


const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(mentorProtegeRouter);
app.use(taskRouter);
app.use(userRouter);
app.use(postRouter);



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
