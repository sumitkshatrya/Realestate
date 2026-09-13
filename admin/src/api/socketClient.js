import { io } from "socket.io-client";

/**
 * Resolves the Socket.io server URL with robust fallbacks for production & development.
 */
const getSocketUrl = () => {
  let raw =
    import.meta.env.VITE_API_URL 

  if (typeof raw === "string" && raw.trim()) {
    let clean = raw.trim();
    if (clean.includes("||")) {
      const parts = clean.split("||").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      clean = parts.find((p) => p.startsWith("https://") || p.startsWith("http://")) || parts[0];
    }
    clean = clean.replace(/^["']|["']$/g, "").replace(/\/+$/, "").replace(/\/api$/, "");
    if (clean && clean !== "undefined" && clean !== "null") {
      return clean;
    }
  }

  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return window.location.origin;
  }

  return "http://localhost:8080";
};

let socket;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = getSocketUrl();

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
