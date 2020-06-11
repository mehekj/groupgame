$(function () {
    var socket = io();

    var nickname;
    var room;
    var player;

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
            socket.emit('chat message', nickname, player, room, $('#message-form input').val())
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
        socket.emit('drop token', room, $('.column').index(this), player);
    });


    socket.on('new joined', function(nickname, gameRoom, playerNum) {
        room = gameRoom;
        if (!player) {
            player = playerNum;   
        }
        message(`<em>${nickname} <span class="p${playerNum}">(player ${playerNum})</span> has joined room ${room}<em>`);
        $('#play-screen').css('display', 'flex');
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });

    socket.on('chat message', function(nickname, player, text) {
        message(`<strong class="p${player}">${nickname}:</strong> ${text}`);
    });

    socket.on('draw board', function(gameSize) {
        message(`<em>Everyone's here! Starting game...<em>`);
        drawBoard('#game', gameSize);
    });

    socket.on('update board', function(column, player) {
        dropToken($('.column').eq(column), player);
    })

    socket.on('user left', function() {
        $('#game').html('');
        message(`<em>A player left. Please refresh this page and create a new room.<em>`);
    });
});

function message(content) {
    $('#messages').append(`<li>${content}</li>`);
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}