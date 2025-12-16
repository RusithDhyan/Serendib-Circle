import mongoose from "mongoose";

const ExperienceInquirySchema = new mongoose.Schema({
   expId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
  name: String,
  email: String,
  phone: String,
  exp_type: String,
  title: String,
  message: String,
  ip_address: String,
},
  {
    timestamps: true,
  }

);

export default mongoose.models.ExperienceInquirySchema ||
  mongoose.model("ExperienceInquiry", ExperienceInquirySchema);
