// models/User.js
import mongoose from "mongoose";

const PageExpSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  image_right: String,
  description_right: String,
  image_left: String,
  description_left: String

});

export default mongoose.models.PageExp ||
  mongoose.model("PageExp", PageExpSchema);
