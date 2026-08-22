import dotenv from "dotenv";
import DBconnect from "./lib/db.js";
import app from "./app.js";
dotenv.config();
DBconnect();

app.listen(process.env.PORT, async () => {
  console.log("server is running on 8080");
});
