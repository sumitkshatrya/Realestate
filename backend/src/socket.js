import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, server-to-server, curl)
        // or any web origin in production
        return callback(null, true);
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to WebSocket: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

export const emitPropertyCreated = (property) => {
  if (io) {
    io.emit("property:created", property);
  }
};

export const emitPropertyUpdated = (property) => {
  if (io) {
    io.emit("property:updated", property);
  }
};

export const emitPropertyDeleted = (id) => {
  if (io) {
    io.emit("property:deleted", { id });
  }
};
