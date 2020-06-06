$(function () {
    var socket = io();

    var nickname;
    var room;

    $("#new-game").click(function() {
        nickname = $('#nickname').val();
        if (nickname) {
            socket.emit('new game', {nickname: nickname});
        }
    });

    $("#join-game").click(function() {
        nickname = $('#nickname').val();
        room = $('#room').val();

        if (nickname && room) {
            socket.emit('join game', {nickname: nickname, room: room});
        }
    });

    socket.on('new joined', function(data) {
        $('#play-screen').append('<h3>' + data.nickname + ' has joined ' + data.room);
        $('#play-screen').show();
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });
});