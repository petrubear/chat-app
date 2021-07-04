const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const http = require('http');
const path = require('path');
const {generateMessage, generateLocationMessage} = require('./utils/messages');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const staticFolder = path.join(__dirname, '../public');
app.use(express.static(staticFolder));

io.on('connection', (socket) => {
    console.log('==> New websocket connection');

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        } else {
            io.emit('message', generateMessage(message));
            callback();
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage',
            generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('==> user has left!'));
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
