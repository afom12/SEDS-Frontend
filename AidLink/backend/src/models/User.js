const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'donor', 'recipient', 'organization'], default: 'donor' },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    refreshToken: { type: String, default: null, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);





