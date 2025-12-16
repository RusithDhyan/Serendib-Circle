import mongoose from "mongoose";

const AboutBottomSchema = new mongoose.Schema({
  title: String,
  description: String,
  
});

export default mongoose.models.AboutBottom || mongoose.model("AboutBottom", AboutBottomSchema);
