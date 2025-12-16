// models/User.js
import mongoose from "mongoose";

const HomeBottomSchema = new mongoose.Schema({
  title: String,
  description: String,
  bg_image: String,
});

export default mongoose.models.HomeBottom ||
  mongoose.model("HomeBottom", HomeBottomSchema);
