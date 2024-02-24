import express from "express";
import { config } from "dotenv";
import { router } from "./routes/bootcamps.js";
import morgan from "morgan";
import { createConnection } from "./config/db.js";

config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;

const connectionStatus = createConnection();

if (connectionStatus === 1) {
  console.log("Database connection failed");
  process.exit(1);
}

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/bootcamp", router);
