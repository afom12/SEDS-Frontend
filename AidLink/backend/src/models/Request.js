const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'fulfilled'],
      default: 'submitted',
    },
    amountRequested: { type: Number, required: true, min: 0 },
    amountRaised: { type: Number, default: 0, min: 0 },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);




