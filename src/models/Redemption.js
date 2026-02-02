const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['dining', 'room', 'experience'],
      required: true,
    },
    pointsCost: {
      type: Number,
      required: true,
    },
    dollarValue: {
      type: Number,
      required: true,
    },
    voucherCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'used', 'expired'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if expired
redemptionSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date() && this.status === 'active';
});

// Static method to expire old vouchers
redemptionSchema.statics.expireOldVouchers = async function() {
  const now = new Date();
  
  const result = await this.updateMany(
    {
      status: 'active',
      expiresAt: { $lt: now }
    },
    {
      $set: { status: 'expired' }
    }
  );

  console.log(`✅ Expired ${result.modifiedCount} vouchers`);
  return result.modifiedCount;
};

// Static method to get user's active vouchers (auto-expire first)
redemptionSchema.statics.getUserVouchers = async function(userId) {
  // First, expire old ones
  await this.expireOldVouchers();
  
  // Then return user's vouchers
  return this.find({ userId }).sort({ createdAt: -1 });
};

export default mongoose.models.Redemption || mongoose.model('Redemption', redemptionSchema);