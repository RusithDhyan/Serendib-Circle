import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  offer_type: String,
  title: String,
  main_description: String,
  description: String,
  image: String,
  bg_image: {
    type: String,
    default: "/all-images/offer/bg.jpg", // or a fallback image path
  },
  cover_image: String,
  bulletPoints: { type: [String], default: [] },

});

export default mongoose.models.Offer ||
  mongoose.model("Offer", OfferSchema);
