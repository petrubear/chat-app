const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // e.target es el form
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message);
});
