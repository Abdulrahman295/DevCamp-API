import express from "express";
import { config } from "dotenv";
import { router } from "./routes/bootcamps.js";
import morgan from "morgan";

config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/bootcamp", router);
