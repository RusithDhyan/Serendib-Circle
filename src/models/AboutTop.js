import mongoose from "mongoose";

const AboutTopSchema = new mongoose.Schema({
  title: String,
  vision_title: String,
  description: String,
  body_title: String,
  body_description: String,
  content_image: String,
  bg_image: {
    type: String,
    default: "/all-images/about/about.jpeg",
  },
  
});

export default mongoose.models.AboutTop || mongoose.model("AboutTop", AboutTopSchema);
