import { getWebSocketUrl } from './ws-url.js';

const socket = new WebSocket(getWebSocketUrl());

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