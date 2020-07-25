'use strict';
var socket = io();

// set this socket as user role
// params `u` is the user's username
socket.emit('set client', params.u);

// set username on socket
socket.username = params.u;

$(document).ready(function(){
	const $chatForm = $('#chatForm');

	$('#chatButton').click(function() {
		$('#chatBox').toggle("slide");

		// put client into their own room
		const roomName = 'room-' + socket.username;
		socket.emit('create room', roomName);
		$chatForm.data('room', roomName);

		// Display welcome message after joining room
		socket.on('welcome', () => {
			$('#messages').append('<li class="SERVER">[SERVER]: A support rep will be with you shortly.</li>');
		});

		// updates the chat window
		socket.on('update chat', params => {
			const $messages = $('#messages');

			$messages.append('<li class="message">' + '<span title="' + params.time + '">[' + params.username + ']</span>: ' + params.message + '</li>');
		});
	});

	$chatForm.on('submit', function(evt) {
		const roomName = $chatForm.data('room');
		const message = $chatForm.find('input').val();
		const timestamp = (new Date()).toISOString();

		evt.preventDefault();

		socket.emit('chat message', {
			username: socket.username,
			room: roomName,
			message: message,
			time: timestamp
		});

		$chatForm.find('input').val('');

		return false;
	});

});