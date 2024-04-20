import { io } from "socket.io-client"

function SocketConnection() {
    let socket 
    let baseUrl = process.env.NEXT_PUBLIC_API_URL
    return socket = io(baseUrl)
}

export default SocketConnection