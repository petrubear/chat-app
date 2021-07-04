const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const staticFolder = path.join(__dirname, '../public');
app.use(express.static(staticFolder));

io.on('connection', (socket) => {
    console.log('==> New websocket connection');

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message',
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', '==> user has left!');
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
