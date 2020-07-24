'use strict';
var socket = io();

// set this socket as user role
// params `u` is the user's username
socket.emit('set client', params.u);

$(document).ready(function(){
	$('#chatButton').click(function() {
		$('#chatBox').toggle("slide");

		// put client into their own room
		const roomName = 'room-' + socket.username;
		socket.emit('join room', roomName);

		// Display welcome message after joining room
		socket.on('welcome', () => {
			$('#messages').append('<li>A support rep will be with you shortly.</li>');
		});
	});

	$("#chatForm").submit(function(e){
		e.preventDefault();
	});
});