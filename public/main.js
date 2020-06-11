$(function () {
    var socket = io();

    var nickname;
    var room;

    var rows = 6;
    var cols = 7;

    $('#new-game').click(function() {
        nickname = $('#nickname').val();
        if (nickname) {
            socket.emit('new game', nickname);
        }
    });

    $('#join-game').click(function() {
        nickname = $('#nickname').val();
        room = $('#room').val();

        if (nickname && room) {
            socket.emit('join game', nickname, room);
        }
    });

    $('#message-form').submit(function (e) {
        e.preventDefault();

        if ($('#message-form input').val()) {
            socket.emit('chat message', nickname, room, $('#message-form input').val())
            $('#message-form input').val('');
        }
        return false;
    });

    $(document).on('mouseenter', '.column', function() {
        columnHoverEnter(this);
    });

    $(document).on('mouseleave', '.column', function() {
        columnHoverLeave(this);
    });

    $(document).on('click', '.column', function () {
        dropToken(this);
    });



    socket.on('new joined', function(nickname, gameRoom) {
        room = gameRoom;
        message(`<em>${nickname} has joined room ${room}<em>`);
        $('#play-screen').css('display', 'flex');
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });

    socket.on('chat message', function(nickname, text) {
        message(`<strong>${nickname}:</strong> ${text}`);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('start game', function(gameSize) {
        message(`<em>Everyone's here! Starting game...<em>`);
        drawBoard('#game', rows, cols, gameSize);
    });

    socket.on('user left', function() {
        $('#game').html('');
        message(`<em>A player left. Please wait for someone else to join to restart game or refresh this page and create a new room.<em>`);
    });
});

function message(content) {
    $('#messages').append(`<li>${content}</li>`);
}