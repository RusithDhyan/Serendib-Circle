import mongoose from "mongoose";

const MetaDataSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  meta_title: String,
  meta_description: String,
});

export default mongoose.models.MetaData ||
  mongoose.model("MetaData", MetaDataSchema);
