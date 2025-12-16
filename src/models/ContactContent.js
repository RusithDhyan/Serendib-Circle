import mongoose from "mongoose";
const ContactContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  email: String,
  phone: String,
  bg_image: {
    type: String,
    default: "/all-images/contact/contact-cover.jpg",
  },
  
});

export default mongoose.models.ContactContent || mongoose.model("ContactContent", ContactContentSchema);
