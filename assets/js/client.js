'use strict';
var socket = io();

$(document).ready(function(){
	$('#chatButton').click(function() {
		$('#chatBox').toggle("slide");

		// put client into their own room
		const roomName = 'room-' + socket.username;
		socket.emit('join room', roomName);

		socket.on('welcome', () => {
			$('#messages').append('<li>A support rep will be with you shortly.</li>');
		});
	});
});