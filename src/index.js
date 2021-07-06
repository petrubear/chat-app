const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const http = require('http');
const path = require('path');
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const staticFolder = path.join(__dirname, '../public');
app.use(express.static(staticFolder));

io.on('connection', (socket) => {
    console.log('==> New websocket connection');

    // socket.emit('message', generateMessage('Welcome!'));
    // socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({
            id: socket.id,
            username: username,
            room: room,
        });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('message',
            generateMessage(`${user.username} has joined!`));

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        } else {
            io.to('test').emit('message', generateMessage(message));
            callback();
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage',
            generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
        }
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
