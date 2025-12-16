import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  main_title: String,
  main_description: String,
  body_title: String,
  body_description: String,
  image: String,
  bg_image: {
    type: String,
    default: "/all-images/experience/exp-inner-bg.jpg",
  },
  image_slider: [String],
  bulletPoints: { type: [String], default: [] },
  
});

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
