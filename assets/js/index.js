'use strict';
var socket = io();


$( "#selectAdmin" ).click(function() {
    var username = $("#userInput").val();
    socket.emit('set admin', username);
});

$( "#selectClient" ).click(function() {
    var username = $("#userInput").val();
    socket.emit('set client', username);
});
