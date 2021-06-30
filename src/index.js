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

let count = 0;
io.on('connection', (socket) => {
    console.log('new websocket connection');
    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        // socket.emit('countUpdated', count); // notifica a uno
        io.emit('countUpdated', count); // notifica a todos
    });
});



server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
