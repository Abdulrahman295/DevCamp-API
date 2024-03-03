import fs from "fs";
import { config } from "dotenv";
import Bootcamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import { createConnection } from "./config/db.js";

config({ path: "./config/config.env" });

createConnection();

const bootcamps = JSON.parse(
  fs.readFileSync("./_data/bootcamps.json", "utf-8")
);

const courses = JSON.parse(fs.readFileSync("./_data/courses.json", "utf-8"));

const loadData = () => {
  Bootcamp.create(bootcamps)
    .then(() => {
      console.log("bootcamps loaded successfully!");
      return Course.create(courses);
    })
    .then(() => {
      console.log("courses loaded successfully!");
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
};

const deleteData = () => {
  Bootcamp.deleteMany()
    .then(() => {
      console.log("bootcamps deleted successfully!");
      return Course.deleteMany();
    })
    .then(() => {
      console.log("courses deleted successfully!");
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
};

if (process.argv[2] === "-l") loadData();

if (process.argv[2] === "-d") deleteData();
