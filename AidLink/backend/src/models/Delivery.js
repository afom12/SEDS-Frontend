const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered', 'confirmed'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    proof: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);


