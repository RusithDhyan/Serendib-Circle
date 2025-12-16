import mongoose from "mongoose";

const OfferInquirySchema = new mongoose.Schema(
  {
  name: String,
  email: String,
  offer_title: String,
  guests: Number,
  total_price: Number,
  phone: String,
  inquiry_type: String,
  message: String,
  ip_address: String,

  },

  {
    timestamps: true, // ⬅️ This auto adds createdAt and updatedAt
  }

);

export default mongoose.models.OfferInquiry ||
  mongoose.model("OfferInquiry", OfferInquirySchema);
