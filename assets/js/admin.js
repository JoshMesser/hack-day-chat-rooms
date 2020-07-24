'use strict';
var socket = io();

// set this socket as admin role
// params `u` is the user's username
socket.emit('set admin', params.u);

$(document).ready(function(){

	socket.on('room list', (rooms) => {
		console.log('room list', rooms);
	});

	socket.emit('request rooms');

});