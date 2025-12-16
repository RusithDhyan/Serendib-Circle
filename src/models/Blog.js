// models/User.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  description: String,
  main_title: String,
  main_description: String,
  body_title: String,
  body_description: String,
  bottom_title: String,
  bottom_description: String,
  thumbnail: String,
  bg_image: {
    type: String,
    default: "/all-images/blog/bg1.jpg",
  },
  cover_image: String
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
