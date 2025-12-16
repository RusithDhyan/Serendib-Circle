import mongoose from "mongoose";

const HomeSliderSchema = new mongoose.Schema({
  title: String,
  home_slider_image: [String],
});

export default mongoose.models.HomeSlider ||
  mongoose.model("HomeSlider", HomeSliderSchema);
