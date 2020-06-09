var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = '/index.html';


var gameSize = 2;
var rows = 6;
var cols = 7;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
    socket.on('new game', function(nickname) {
        var room = 'room-' + Math.floor(Math.random() * 10000);
        socket.join(room);
        io.to(room).emit('new joined', nickname, room);
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
            io.to(room).emit('new joined', nickname, room);
        }

        if (io.sockets.adapter.rooms[room].length == gameSize) {
            io.to(room).emit('start game', rows, cols, gameSize);
        }
    });

    socket.on('chat message', function(nickname, room, text) {
        io.to(room).emit('chat message', nickname, text);
    });
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT);
});