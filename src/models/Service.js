// models/User.js
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  
  service_type: [String]

});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
