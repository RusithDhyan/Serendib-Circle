// models/User.js
import mongoose from "mongoose";

const ExperienceContentSchema = new mongoose.Schema({
  expId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
  title: String,
  description: String, 
  bulletPoints: { type: [String], default: [] },
});

export default mongoose.models.ExperienceContent || mongoose.model("ExperienceContent", ExperienceContentSchema);
