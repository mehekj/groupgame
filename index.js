var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = '/index.html';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
    socket.on('new game', function(data) {
        var room = 'room-' + Math.floor(Math.random() * 10000);
        socket.join(room);
        io.to(room).emit('new joined', {nickname: data.nickname, room: room});
    });

    socket.on('join game', function(data) {
        if (!(io.sockets.adapter.rooms[data.room])) {
            socket.emit('login error', 'Invalid room code');
        }
        else if (io.sockets.adapter.rooms[data.room].length >= 2) {
            socket.emit('login error', 'This room is full');
        }
        else {
            socket.join(data.room);
            io.to(data.room).emit('new joined', {nickname: data.nickname, room: data.room});
        }
    });

    socket.on('chat message', function(msg) {
        io.to(msg.room).emit('chat message', msg);
    });
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT);
});