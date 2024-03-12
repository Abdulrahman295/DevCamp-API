import e from "express";
import mongoose from "mongoose";
import Bootcamp from "./Bootcamp.js";

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.statics.getAverageRating = function (targetId) {
  return this.aggregate([
    {
      $match: { bootcamp: targetId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ])
    .then((result) => {
      return Bootcamp.findByIdAndUpdate(targetId, {
        averageRating: result[0].averageRating.toFixed(1),
      });
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
};

ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

export default mongoose.model("Review", ReviewSchema);
