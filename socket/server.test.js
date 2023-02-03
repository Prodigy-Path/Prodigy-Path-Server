/** @format */

const { startIo } = require('../app');

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('socket.io test', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    startIo(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should emit proofOfLife event', (done) => {
    clientSocket.on('proofOfLife', (arg) => {
      expect(arg).toEqual('This is the proof of life');
      done();
    });
    serverSocket.emit('proofOfLife', 'This is the proof of life');
  });

  test('should join room and emit USER_CONNECTED event', (done) => {
    clientSocket.emit('JOIN', 'room1');
    clientSocket.on('USER_CONNECTED', (arg) => {
      expect(arg).toBe('New user connected.');
      done();
    });
    serverSocket.emit('USER_CONNECTED', 'New user connected.');
  });

  test('should start chat and emit CHAT_STARTING event', (done) => {
    clientSocket.emit('JOIN', 'room1');
    clientSocket.emit('CHAT_STARTING');
    clientSocket.on('CHAT_STARTING', (arg) => {
      expect(arg).toBe('The chat is starting!');
      done();
    });
    serverSocket.emit('CHAT_STARTING', 'The chat is starting!');
  });

  test('should get list of available rooms', (done) => {
    clientSocket.emit('GET_ROOMS');
    clientSocket.on('ROOMS', (arg) => {
      expect(arg).toBeInstanceOf(Array);
      done();
    });
  });
  test('should leave room and emit USER_DISCONNECTED event', (done) => {
    clientSocket.emit('JOIN', 'room1');
    clientSocket.on('USER_DISCONNECTED', (arg) => {
      expect(arg).toBe('User disconnected.');
      done();
    });
    clientSocket.emit('LEAVE_ROOM', 'room1');
    serverSocket.emit('USER_DISCONNECTED', 'User disconnected.');
  });

  test('should receive message and emit RECEIVE_MESSAGE event', (done) => {
    clientSocket.emit('JOIN', 'room1');
    clientSocket.on('RECEIVE_MESSAGE', (arg) => {
      expect(arg).toEqual('Hello, world!');
      done();
    });
    serverSocket.emit('RECEIVE_MESSAGE', 'Hello, world!', 123, 'room1');
  });

  test('should receive message and emit SEND_MESSAGE event', (done) => {
    clientSocket.emit('JOIN', 'room1');
    clientSocket.on('SEND_MESSAGE', (arg) => {
      expect(arg).toEqual('Hello, world!');
      done();
    });
    serverSocket.emit('SEND_MESSAGE', 'Hello, world!', 123, 'room1');
  });
});
