var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = '/index.html';

var rooms = 0;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
    
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT);
});