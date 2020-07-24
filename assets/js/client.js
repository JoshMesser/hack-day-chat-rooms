'use strict';
var socket = io();


$(document).ready(function(){
	$('#chatButton').click(function() {
		$('#chatBox').toggle("slide");
		socket.emit('request admin', socket.username);
	});
});