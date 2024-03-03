import mongoose from "mongoose";

export const createConnection = () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      process.exit(1);
    });
};
