import dotenv from "dotenv";
import DBconnect from "./lib/db.js";
import app from "./app.js";
dotenv.config();
DBconnect();

async function startServer() {
  try {
    await DBconnect(); // Ensure DB connection is established before starting the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB or start server:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
}

startServer();
