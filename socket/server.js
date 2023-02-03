/** @format */

const startIo = (io) => {
  let sockets = new Array();

  setInterval(() => {
    sockets = [];
  }, 500000);

  io.on('connection', (socket) => {
    socket.on('JOIN', (roomName) => {
      socket.join(roomName);

      socket.to(roomName).emit('USER_CONNECTED', 'New user connected.');
      sockets.push(roomName);
      socket.emit('ROOMS', sockets);

      socket.on('SEND_MESSAGE', (text, id, room) => {
        let payload = {
          text: text,
          id: id,
        };
        socket.to(room).emit('RECEIVE_MESSAGE', payload);
      });

      socket.on('LEAVE_ROOM', (roomName) => {
        socket.leave(roomName);
      });
    });
  });
};

module.exports = startIo;
