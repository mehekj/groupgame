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
        var room = Math.floor(Math.random() * 100000000);
        socket.join(room);
        io.to(room).emit('new joined', nickname, room, io.sockets.adapter.rooms[room].length);
    });

    socket.on('join game', function(nickname, room) {
        if (!(io.sockets.adapter.rooms[room])) {
            socket.emit('login error', 'Invalid room code');
        }
        else if (io.sockets.adapter.rooms[room].length >= gameSize) {
            socket.emit('login error', 'This room is full');
        }
        else {
            socket.join(room);
            io.to(room).emit('new joined', nickname, room, io.sockets.adapter.rooms[room].length);
        }

        if (io.sockets.adapter.rooms[room].length == gameSize) {
            io.to(room).emit('draw board', gameSize);
        }
    });

    socket.on('chat message', function(nickname, player, room, text) {
        io.to(room).emit('chat message', nickname, player, text);
    });

    socket.on('drop token', function (room, column, player) {
        io.to(room).emit('update board', column, player);
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