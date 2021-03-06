$(function () {
    var socket = io();

    var nickname;
    var room;
    var player;
    var score = 0;

    var currentTurn = false;

    $('#new-game').click(function() {
        nickname = $('#nickname').val();
        if (nickname) {
            socket.emit('new game', nickname, $("#room-size").val());
        }
    });

    $('#join-game').click(function() {
        nickname = $('#nickname').val();
        room = $('#room').val();

        if (nickname && room) {
            socket.emit('join game', {nickname: nickname, room: room});
        }
    });

    $('#message-form').submit(function (e) {
        e.preventDefault();

        if ($('#message-form input').val()) {
            socket.emit('chat message', {nickname: nickname, player: player, room: room, text: $('#message-form input').val()});
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
        if (currentTurn) {
            if (dropToken(this, player)) {
                socket.emit('drop token', {room: room, column: $('.column').index(this), player: player});   
                if (checkWin()) {
                    socket.emit('game over win', room, player);
                }
                else if (checkDraw()) {
                    socket.emit('game over draw', room);
                }
                else {
                    socket.emit('end turn', room, player);
                    currentTurn = false;
                }
            }
        }
    });

    $(document).on('click', '#reset', function() {
        socket.emit('reset game', room);
    });


    socket.on('new joined', function(data) {
        room = data.room;
        if (!player) {
            player = data.player;   
        }
        message(`<em>${data.nickname} <span class="p${data.player}">(player ${data.player})</span> has joined room ${data.room}<em>`);
        $('#play-screen').css('display', 'flex');
        $('#join-screen').hide();
    });

    socket.on('login error', function(text) {
        $('#login-warning').html(text);
    });

    socket.on('chat message', function(msg) {
        message(`<strong class="p${msg.player}">${msg.nickname}:</strong> ${msg.text}`);
    });

    socket.on('draw board', function(gameSize) {
        message(`<em>Starting game...<em>`);
        drawBoard('#game', gameSize);
    });

    socket.on('start turn', function() {
        currentTurn = true;
        socket.emit('prompt turn', room, player);
    });

    socket.on('prompt turn', function(player) {
        $('#prompt').html(`<strong class="p${player}">Player ${player}'s turn</strong>`);
    });

    socket.on('update board', function(data) {
        dropToken($('.column').eq(data.column), data.player);
    });

    socket.on('you win', function () {
        score++;
    });

    socket.on('game over win', function(playerNum) {
        currentTurn = false;
        $('#prompt').html('<button id="reset">Play Again</button>');
        message(`<strong>Game over! <span class="p${playerNum}">Player ${playerNum} wins!</span></strong>`);
        socket.emit('score update', {nickname: nickname, player: player, room: room, score: score});
    });
    
    socket.on('game over draw', function() {
        currentTurn = false;
        $('#prompt').html('<button id="reset">Play Again</button>');
        message(`<strong>Game over! It's a draw!</strong>`);
    });

    socket.on('score update', function(data) {
        message(`<strong class="p${data.player}">${data.nickname}'s score:</strong> ${data.score} wins`)
    });

    socket.on('user left', function() {
        $('#game').html('<h2>A player left. Please refresh this page and create a new room.</h2>');
    });
});

function message(content) {
    $('#messages').append(`<li>${content}</li>`);
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}