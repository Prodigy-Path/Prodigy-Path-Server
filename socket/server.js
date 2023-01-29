/** @format */

const startIo = (io) => {
  io.on('connection', (socket) => {
    console.log('IO server connection');

    socket.emit('proofOfLife', 'This is the proof of life');

    socket.on('JOIN', (roomName) => {
      socket.join(roomName);
      console.log(`Joined room: ${roomName}`);
      socket.to(roomName).emit('USER_CONNECTED', 'New user connected.');
      socket.emit('JOIN', roomName);

      socket.on('CHAT_STARTING', () => {
        socket.to(roomName).emit('CHAT_STARTING', 'The chat is starting!');
      });
    });

    socket.on('GET_ROOMS', () => {
      let availableRooms = [];
      let rooms = io.sockets.adapter.rooms;

      for (const [key, value] of rooms.entries()) {
        if (!value.has(key)) {
          availableRooms.push(key);
        }
      }

      socket.emit('ROOMS', availableRooms);
    });
  });
};

module.exports = startIo;
