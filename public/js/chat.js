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

document.querySelector('#send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation not available');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    });
});
