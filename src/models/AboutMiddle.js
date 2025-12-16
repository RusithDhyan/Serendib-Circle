// models/User.js
import mongoose from "mongoose";

const AboutMiddleSchema = new mongoose.Schema({
  card_title: String,
  card_description: String,
  card_image: String,
  
});

export default mongoose.models.AboutMiddle || mongoose.model("AboutMiddle", AboutMiddleSchema);
