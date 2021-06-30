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

io.on('connection', () => {
    console.log('new websocket connection');
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
