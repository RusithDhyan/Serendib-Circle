// models/User.js
import mongoose from "mongoose";

const AccommodationSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  room_type: String,
  price: Number,
  size: Number,
  description: String,
  image: String,
  images: [String],
  spec_type: [String]

});

export default mongoose.models.Accommodation ||
  mongoose.model("Accommodation", AccommodationSchema);
