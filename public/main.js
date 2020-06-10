$(function () {
    var socket = io();

    var nickname;
    var room;

    var rows = 6;
    var cols = 7;

    $("#new-game").click(function() {
        nickname = $('#nickname').val();
        if (nickname) {
            socket.emit('new game', nickname);
        }
    });

    $("#join-game").click(function() {
        nickname = $('#nickname').val();
        room = $('#room').val();

        if (nickname && room) {
            socket.emit('join game', nickname, room);
        }
    });

    $('#message-form').submit(function (e) {
        e.preventDefault();
        if ($('#message-form input').val()) {
            console.log('message' + this.room);
            socket.emit('chat message', nickname, room, $('#message-form input').val())
            $('#message-form input').val('');
        }
        return false;
    });



    socket.on('new joined', function(nickname, gameRoom) {
        room = gameRoom;
        $('#messages').append(`<li><em>${nickname} has joined room ${room}<em></li>`);
        $('#play-screen').css('display', 'flex');
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });

    socket.on('chat message', function(nickname, text) {
        $('#messages').append(`<li><strong>${nickname}:</strong> ${text}`);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('start game', function(gameSize) {
        $('#messages').append(`<li><em>Everyone's here! Starting game...<em></li>`);
        drawBoard('#game', rows, cols, gameSize);
    });

    socket.on('user left', function() {
        $('#game').html('');
        $('#messages').append(`<li><em>A player left. Please wait for someone else to join to restart game or refresh this page and create a new room.<em></li>`);
    });
});