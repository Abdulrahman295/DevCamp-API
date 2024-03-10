import mongoose from "mongoose";
import Bootcamp from "./Bootcamp.js";
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  weeks: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advanced"],
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

CourseSchema.statics.getAverageCost = function (targetId) {
  return this.aggregate([
    {
      $match: { bootcamp: targetId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$cost" },
      },
    },
  ])
    .then((result) => {
      return Bootcamp.findByIdAndUpdate(targetId, {
        averageCost: Math.ceil(result[0].averageCost / 10) * 10,
      });
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
};

CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

export default mongoose.model("Course", CourseSchema);
