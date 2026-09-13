import { io } from "socket.io-client";
import { getBackendBaseUrl } from "../utils/backendUrl";

let socket;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = getBackendBaseUrl();

    socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log(`🔌 Admin Socket.io connected successfully to ${socketUrl} [id: ${socket.id}]`);
    });

    socket.on("connect_error", (error) => {
      console.warn(`⚠️ Admin Socket.io connection attempt warning (${socketUrl}):`, error.message);
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });
  }
  return socket;
};

export default getSocket;
