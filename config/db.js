import mongoose from "mongoose";

export const createConnection = () => {
  return mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected");
      return 0;
    })
    .catch((err) => {
      console.log(err);
      return 1;
    });
};
