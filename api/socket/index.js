'use strict';
/* api/socket/indjex.js */

const _clients = {};
const _admins = {};
const _rooms = [];

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

    socket.on('join room', (roomName) => {
      socket._room = roomName
      _rooms.push(roomName);

      socket.join(roomName);
      io.to(socket._room).emit('welcome');
    });

    // disconnect event
    socket.on('disconnect', () => {

      if ( socket.isAdmin ) {
        // remove the username from global admins list
        delete _admins[socket.username];
      } else {
        // remove the username from global clients list
        delete _clients[socket.username];
      }

      // echo that client has left
      socket.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
      // remove client from connected room
      socket.leave(socket.room);
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
