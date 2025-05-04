import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

let isConnected = false;

export function connectSocket() {
  if (!isConnected) {
    socket.connect();
    isConnected = true;
  }
}

export default socket;
