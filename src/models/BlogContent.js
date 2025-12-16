// models/User.js
import mongoose from "mongoose";

const BlogContentSchema = new mongoose.Schema({
  blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  title: String,
  description: String, 
  image: String,
  bullet_title: String,
  bulletPoints: { type: [String], default: [] },

});

export default mongoose.models.BlogContent || mongoose.model("BlogContent", BlogContentSchema);
