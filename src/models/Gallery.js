import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  image_slider: [String],
  

});

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", GallerySchema);
