import dotenv from "dotenv";
dotenv.config();

import DBconnect from "./lib/db.js";
import app from "./app.js";

DBconnect();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

