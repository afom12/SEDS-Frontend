const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    amount: { type: Number, required: true, min: 1 },
    anonymous: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
    receiptNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);


