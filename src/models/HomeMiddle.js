// models/User.js
import mongoose from "mongoose";

const HomeMiddleSchema = new mongoose.Schema({
  map_title: String,
  map_description: String,
  blog_title: String,
  blog_description: String,
  blog_image: String,
});

export default mongoose.models.HomeMiddle ||
  mongoose.model("HomeMiddle", HomeMiddleSchema);
