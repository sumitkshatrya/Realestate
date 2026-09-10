import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to WebSocket: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
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

