const socket = io();

// elements
const $messageForm = document.querySelector('#chat-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
    console.log(message);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // disable submit
    $messageFormButton.setAttribute('disabled', 'disabled');

    // e.target es el form
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }

        console.log('message delivered.');
    });
});

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation not available');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!');
        });
    });
});
