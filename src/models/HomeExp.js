// models/User.js
import mongoose from "mongoose";

const HomeExpSchema = new mongoose.Schema({
  type: String,
  card_title: String,
  card_description: String,
  card_image: String
});

export default mongoose.models.HomeExp ||
  mongoose.model("HomeExp", HomeExpSchema);
