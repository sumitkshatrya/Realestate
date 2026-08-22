import dotenv from "dotenv";
import DBconnect from "./lib/db.js";
import app from "./app.js";
dotenv.config();
DBconnect();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
