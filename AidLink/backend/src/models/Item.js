const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);


