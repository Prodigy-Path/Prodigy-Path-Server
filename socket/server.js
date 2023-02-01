const startIo = (io) => {
  io.on('connection', (socket) => {
    console.log('IO server connection');

    socket.emit('proofOfLife', 'This is the proof of life');

    socket.on('JOIN', (roomName) => {
      console.log(roomName);
      socket.join(roomName);
      console.log(`Joined room: ${roomName}`);
      socket.to(roomName).emit('USER_CONNECTED', 'New user connected.');


      // socket.on('CHAT_STARTING', () => {
      //   socket.to(roomName).emit('CHAT_STARTING', 'The chat is starting!');
      // });

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
        // let obj = {
        //   text: 'User disconnected from room.',
        //   room: roomName,
        // };
        // socket.to(roomName).emit('USER_DISCONNECTED', obj);
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
