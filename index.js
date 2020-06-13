var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = '/index.html';


var gameSize = 2;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
    socket.on('new game', function(nickname) {
        let room = Math.floor(Math.random() * 100000000);
        socket.join(room);
        io.to(room).emit('new joined', {nickname: nickname, room: room, player: io.sockets.adapter.rooms[room].length});
    });

    socket.on('join game', function(data) {
        let room = data.room;
        if (!(io.sockets.adapter.rooms[room])) {
            socket.emit('login error', 'Invalid room code');
        }
        else if (io.sockets.adapter.rooms[room].length >= gameSize) {
            socket.emit('login error', 'This room is full');
        }
        else {
            socket.join(room);
            io.to(room).emit('new joined', {nickname: data.nickname, room: room, player: io.sockets.adapter.rooms[room].length});

            if (io.sockets.adapter.rooms[room].length == gameSize) {
                io.to(room).emit('draw board', gameSize);
                io.to(Object.keys(io.sockets.adapter.rooms[room].sockets)[0]).emit('start turn');
            }
        }
    });

    socket.on('chat message', function(msg) {
        io.to(msg.room).emit('chat message', msg);
    });

    socket.on('prompt turn', function(room, player) {
        io.to(room).emit('prompt turn', player);
    });

    socket.on('drop token', function(data) {
        socket.to(data.room).emit('update board', data);
    });

    socket.on('end turn', function(room, player) {
        io.to(Object.keys(io.sockets.adapter.rooms[room].sockets)[player % gameSize]).emit('start turn');
    });

    socket.on('game over win', function(room, player) {
        io.to(room).emit('game over win', player);
    });

    socket.on('game over draw', function(room) {
        io.to(room).emit('game over draw');
    });

    socket.on('disconnecting', function(reason) {
        if (Object.keys(socket.rooms)[0]) {
            io.to(Object.keys(socket.rooms)[0]).emit('user left');
        }
    });
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT);
});