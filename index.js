var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = '/index.html';

var games = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
    socket.on('new game', function(nickname, roomSize) {
        let room = Math.floor(Math.random() * 100000000);
        socket.join(room);
        games[room] = roomSize;
        io.to(room).emit('new joined', {nickname: nickname, room: room, player: io.sockets.adapter.rooms[room].length});
    });

    socket.on('join game', function(data) {
        let room = data.room;
        if (!(io.sockets.adapter.rooms[room]) || !(games[room])) {
            socket.emit('login error', 'Invalid room code');
        }
        else if (io.sockets.adapter.rooms[room].length >= games[room]) {
            socket.emit('login error', 'This room is full');
        }
        else {
            socket.join(room);
            io.to(room).emit('new joined', {nickname: data.nickname, room: room, player: io.sockets.adapter.rooms[room].length});

            if (io.sockets.adapter.rooms[room].length == games[room]) {
                io.to(room).emit('draw board', games[room]);
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
        io.to(Object.keys(io.sockets.adapter.rooms[room].sockets)[player % games[room]]).emit('start turn');
    });

    socket.on('game over win', function(room, player) {
        io.to(Object.keys(io.sockets.adapter.rooms[room].sockets)[player - 1]).emit('you win');
        io.to(room).emit('game over win', player);
    });

    socket.on('game over draw', function(room) {
        io.to(room).emit('game over draw');
    });

    socket.on('reset game', function(room) {
        io.to(room).emit('draw board', games[room]);
        io.to(Object.keys(io.sockets.adapter.rooms[room].sockets)[0]).emit('start turn');
    });

    socket.on('score update', function(data) {
        io.to(data.room).emit('score update', data);
    });

    socket.on('disconnecting', function(reason) {
        if (Object.keys(socket.rooms)[0]) {
            room = Object.keys(socket.rooms)[0];
            delete games[room];
            io.to(room).emit('user left');
        }
    });
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT);
});