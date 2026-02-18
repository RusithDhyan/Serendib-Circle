// const mongoose = require('mongoose');
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    hotel: {
      type: String,
      enum: ['waters_edge', 'bamboo_boutique_hotel', 'kambiri_beach_resort', 'blue_waters'],
      required: true,
    },
    type: {
      type: String,
      enum: ['earn','redeem']
    },
    amount: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
