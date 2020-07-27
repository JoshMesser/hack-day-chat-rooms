'use strict';
var socket = io();

// set this socket as user role
// params `u` is the user's username
socket.emit('set client', params.u);

// set username on socket
socket.username = params.u;

// updates the chat window
socket.on('update chat', params => {
	const $messages = $('#messages');

	$messages.append('<li class="'+ (params.username === 'SERVER' ? 'event' : 'message') +'">' + '<span title="' + params.time + '">[' + params.username + ']</span>: ' + params.message + '</li>');

	if ( params.joined ) {
		$('#chatBox .chatHeader p').html('Chatting with ' + params.joined);
	}
});

$(document).ready(function(){
	const $chatForm = $('#chatForm');

	$('#chatButton').click(function() {
		$('#chatBox').toggle("slide");

		// put client into their own room
		const roomName = 'room-' + socket.username;
		socket.emit('create room', roomName);
		$chatForm.data('room', roomName);
	});

	$chatForm.on('submit', function(evt) {
		const $input = $chatForm.find('input');
		const message = $input.val();

		evt.preventDefault();

		socket.emit('send chat', message);

		$input.val('');

		return false;
	});

});