import express from "express";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";
import bootcampsRouter from "./routes/bootcamps.js";
import coursesRouter from "./routes/courses.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import reviewsRouter from "./routes/reviews.js";
import { createConnection } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

config({ path: "./config/config.env" });

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const app = express();

const server = app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});

createConnection();

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/bootcamps", bootcampsRouter);
app.use("/courses", coursesRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);
app.use(errorHandler);
