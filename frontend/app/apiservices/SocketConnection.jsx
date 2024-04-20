import { io } from "socket.io-client"

function SocketConnection() {
    let socket 
    return socket = io('http://172.20.10.4:3001')
}

export default SocketConnection