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

    $('#message-form').submit(function (e) {
        e.preventDefault();
        if ($('#message-form input').val()) {
            socket.emit('chat message', {nickname: nickname, room: room, text: $('#message-form input').val()})
            $('#message-form input').val('');
        }
        return false;
    });

    socket.on('new joined', function(data) {
        room = data.room;
        $('#messages').append('<li><em>' + data.nickname + ' has joined ' + room + '<em></li>');
        $('#play-screen').css('display', 'flex');
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });

    socket.on('chat message', function(msg) {
        $('#messages').append('<li><strong>' + msg.nickname + ':</strong> ' + msg.text);
    })
});