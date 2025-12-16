// models/User.js
import mongoose from "mongoose";

const OfferContentSchema = new mongoose.Schema({
  offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
  title: String,
  subtitle: String, 
  description: String, 
  bulletPoints: { type: [String], default: [] },
  price: Number, 
  validity: String,
  image: String,
});

export default mongoose.models.OfferContent || mongoose.model("OfferContent", OfferContentSchema);
