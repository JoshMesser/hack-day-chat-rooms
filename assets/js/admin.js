'use strict';
var socket = io();

// set this socket as admin role
// params `u` is the user's username
socket.emit('set admin', params.u);

// set username on socket
socket.username = params.u;

$(document).ready(function(){
	const $rooms = $('#rooms');
	const $chatBox = $('#chatBox');
	const $chatForm = $('#chatForm');

	/**
	 * Click Action
	 * Admin clicks a room name we need to join the room
	 */
	$rooms.on('click', 'a.room', function(evt) {
		const $this = $(this);
		const roomName = $.trim( $this.data('room') );
		const username = $this.text();

		evt.preventDefault();

		$chatBox.hide();

		socket.emit('join room', roomName);
		$chatForm.data('room', roomName);
		$chatBox.toggle('slide');

		$('#chatBox .chatHeader p').html('Chatting with ' + username);

		return false;
	});

	$chatForm.on('submit', function(evt) {
		const $input = $chatForm.find('input');
		const message = $input.val();

		evt.preventDefault();

		socket.emit('send chat', message);

		$input.val('');

		return false;
	});

	/**
	 * Room List
	 * Sends an array of the active rooms
	 */
	socket.on('room list', rooms => {
		rooms.forEach(function(room) {
			$rooms.append('<li><a href="#0" class="room" data-room="' + room.room + '">' + room.username + '</a></li>');
		});
	});

	// updates the chat window
	socket.on('update chat', params => {
		const $messages = $('#messages');

		$messages.append('<li class="'+ (params.username === 'SERVER' ? 'event' : 'message') +'">' + '<span title="' + params.time + '">[' + params.username + ']</span>: ' + params.message + '</li>');
	});

	socket.emit('request rooms');

});