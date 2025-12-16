// models/User.js
import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  hotel_name: String,
  title: String,
  location:String,
  description: String,
  thumbnail: String,
  image: String,
  cover_image: String
  
});

export default mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
