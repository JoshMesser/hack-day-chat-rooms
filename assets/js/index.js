'use strict';
var socket = io();


$( "#selectAdmin" ).click(function() {
    var username = $("#userInput").val();
    document.location = '/admin?u='+username;
});

$( "#selectClient" ).click(function() {
    var username = $("#userInput").val();
    document.location = '/client?u='+username;
});
