const startIo = (io) => {
  let sockets = new Array();

  setInterval(() => {
    sockets = [];
  }, 300000);

  io.on('connection', (socket) => {
    console.log('IO server connection');    
    socket.on('JOIN', (roomName) => {
      console.log(roomName);
      socket.join(roomName);
      console.log(`Joined room: ${roomName}`);
      socket.to(roomName).emit('USER_CONNECTED', 'New user connected.');
      sockets.push(roomName);
      socket.emit('ROOMS', sockets);
      console.log(sockets);
      socket.on('SEND_MESSAGE', (text, id, room) => {
        console.log('test', text, room);
        let payload = {
          text: text,
          id: id,
        };
        socket.to(room).emit('RECEIVE_MESSAGE', payload);
      });
      
      socket.on('LEAVE_ROOM', (roomName) => {
        console.log(`Leaving room: ${roomName}`);
        socket.leave(roomName);
      });
    });
  });
};

module.exports = startIo;
