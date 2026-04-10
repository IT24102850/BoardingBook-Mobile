const mongoose = require('mongoose');

const roommateRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  respondedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for sender-recipient pair
roommateRequestSchema.index({ senderId: 1, recipientId: 1 });
roommateRequestSchema.index({ senderId: 1, createdAt: -1 });
roommateRequestSchema.index({ recipientId: 1, createdAt: -1 });

// Update timestamp on save
roommateRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RoommateRequest', roommateRequestSchema);
