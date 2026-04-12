
class SocketService {
    socket; 

    connect() {
        this.socket = new WebSocket('ws://localhost:3000');

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data)

            console.log('messgae', data)
        }
    }

    send(data) {
        this.socket.send(JSON.stringify(data))
    }


}

const socketService = new SocketService();
export default socketService;