import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8080";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
};

