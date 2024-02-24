import mongoose from "mongoose";
const { Schema } = mongoose;

const BootcampSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  slug: String,
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  averageCost: {
    type: Number,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
});

export default mongoose.model("Bootcamp", BootcampSchema);
