const socket = io();

socket.on('countUpdated', (count) => {
    console.log(`count has been updated to ${count}`);
});

const incrementButton = document.querySelector('#increment');
incrementButton.addEventListener('click', () => {
    socket.emit('increment');
});
