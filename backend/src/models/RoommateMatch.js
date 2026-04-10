const mongoose = require('mongoose');

const roommateMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  targetProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoommateProfile',
    required: true,
  },
  action: {
    type: String,
    enum: ['like', 'pass'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index to prevent duplicate likes/passes
roommateMatchSchema.index({ userId: 1, targetProfileId: 1 }, { unique: true });

module.exports = mongoose.model('RoommateMatch', roommateMatchSchema);
