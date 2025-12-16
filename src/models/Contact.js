import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    inquiry_type: String,
    message: String,
    hotel_name: String,
    ip_address: String,
  },

  {
    timestamps: true, // ⬅️ This auto adds createdAt and updatedAt
  }
);

export default mongoose.models.ContactSchema ||
  mongoose.model("Contact", ContactSchema);
