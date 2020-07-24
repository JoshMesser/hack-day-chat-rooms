'use strict';
/* api/socket/indjex.js */

const _clients = {};
const _admins = {};

/*
  Configure socket.io events.
*/
let bootstrap = (io) => {
  // connection event
  io.on('connection', (socket) => {

    socket.on('set client', (username) => {
      socket.username = username;
      socket.isAdmin = false;
      _clients[username] = socket;
    });

    socket.on('set admin', (username) => {
      socket.username = username;
      socket.isAdmin = true;
      _admins[username] = socket;
    });

    // disconnect event
    socket.on('disconnect', () => {

      if ( socket.isAdmin ) {
        // remove the username from global admins list
        delete _admins[socket.username];

        // remove admin from all connected rooms
        for (let i = 0; i < socket.rooms.length; i++) {
          const room = socket.rooms[i];
          // echo that client has left
          socket.to(room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
          socket.leave(room);
        }

      } else {
        // remove the username from global clients list
        delete _clients[socket.username];
        // echo that client has left
        socket.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        // remove client from connected room
        socket.leave(socket.room);
      }

    });

    // chat message event
    socket.on('chat message', (params) => {
      let timestamp = (new Date()).toISOString();

      io.to(socket.room).emit('chat message', {
        nickname: socket.username,
        room: socket.room,
        message: params.message,
        time: timestamp
      });

    });
  });
};

module.exports = {
  bootstrap: bootstrap
};
