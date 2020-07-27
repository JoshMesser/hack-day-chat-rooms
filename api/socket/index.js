'use strict';
/* api/socket/indjex.js */

const _clients = {};
const _admins = {};
const _rooms = [];

function getRoom(name) {
  let returnRoom;

  _rooms.forEach(r => {
    if( r.room === name ) {
      returnRoom = r;
    }
  });

  return returnRoom;
};

/*
  Configure socket.io events.
*/
let bootstrap = (io) => {
  // connection event
  io.on('connection', (socket) => {

    // Set the user as a client
    socket.on('set client', (username) => {
      socket.username = username;
      socket.isAdmin = false;
      _clients[username] = socket;
      console.log('setting socket to client', socket.username);
    });

    // Set the user as a admin
    socket.on('set admin', (username) => {
      socket.username = username;
      socket.isAdmin = true;
      _admins[username] = socket;
      console.log('setting socket to admin', socket.username);
    });

    // Join the user to the requested room
    socket.on('create room', (roomName) => {
      const timestamp = (new Date()).toISOString();

      console.log('client creating room', roomName, socket.username);

      socket.room = roomName;

      _rooms.push({
        room: socket.room,
        username: socket.username,
      });

      socket.join(socket.room);

      // tell admins to update their room list
      io.emit('room list', _rooms);

      // send welcome message
      io.to(socket.room).emit('update chat', {
        username: 'SERVER',
        room: socket.room,
        message: 'A support rep will be with you shortly.',
        time: timestamp
      });
    });

    socket.on('join room', (roomName) => {
      const timestamp = (new Date()).toISOString();
      const message = socket.username + ' has joined';

      console.log('client joining room', roomName, socket.username, 'admin:', socket.isAdmin);

      socket.room = roomName;
      socket.join(socket.room);
      socket.to(socket.room).emit('update chat', {
        joined: socket.username,
        username: 'SERVER',
        room: socket.room,
        message,
        time: timestamp
      });
    });

    // allows admin users to request a list of all active rooms
    socket.on('request rooms', () => {
      console.log('socket request room list', socket.username, socket.isAdmin);
      if ( socket.isAdmin ) {
        socket.emit('room list', _rooms);
      }
    });

    // disconnect event
    socket.on('disconnect', () => {
      const timestamp = (new Date()).toISOString();

      console.log('socket disconnected', socket.username, 'admin:', socket.isAdmin);

      if ( socket.isAdmin ) {
        // remove the username from global admins list
        delete _admins[socket.username];
      } else {
        // remove the username from global clients list
        delete _clients[socket.username];

        // remove the room from global array
        const room = getRoom(socket.room);
        if ( room ) {
          const i = _rooms.indexOf(room);
          if ( i > -1 ) { _rooms.splice(i, 1); }
        }
      }

      // echo that client has left
      io.to(socket.room).emit('update chat', {
        username: 'SERVER',
        room: socket.room,
        message: socket.username + ' has disconnected',
        time: timestamp
      });

      // remove client from connected room
      socket.leave(socket.room);
    });

    // send chat message event
    socket.on('send chat', (message) => {
      const time = (new Date()).toISOString();
      const {username, room} = socket;

      console.log('new chat message from', username, 'in room', room , 'message:', message);

      io.in(room).emit('update chat', {
        username,
        room,
        message,
        time
      });
    });
  });
};

module.exports = {
  bootstrap: bootstrap
};
