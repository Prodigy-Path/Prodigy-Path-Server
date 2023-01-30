/** @format */

const { startIo } = require('../app');

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

xdescribe('socket.io test', () => {
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
});
