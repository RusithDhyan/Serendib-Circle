import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema(
  {
    email: String,
    ip_address: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.NewsLetter ||
  mongoose.model("NewsLetter", NewsLetterSchema);
