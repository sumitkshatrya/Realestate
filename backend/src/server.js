import dotenv from "dotenv";
import http from "http";
import DBconnect from "./lib/db.js";
import app from "./app.js";
import { initSocket } from "./socket.js";

dotenv.config();
DBconnect();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server and WebSocket running on port ${PORT}`);
});
