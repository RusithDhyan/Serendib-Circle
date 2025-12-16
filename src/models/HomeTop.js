// models/User.js
import mongoose from "mongoose";

const HomeTopSchema = new mongoose.Schema({
  title: String,
  description: String,
  main_image: String,
  content_images: [String],
});

export default mongoose.models.HomeTop ||
  mongoose.model("HomeTop", HomeTopSchema);
