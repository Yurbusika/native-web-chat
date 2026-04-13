const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
  
    console.log('Сообщение:', data);
  };

function sendMessage(text) {
    socket.send(JSON.stringify({
        type: 'message',
        text
    }));
}

export {
    socket,
    sendMessage
}