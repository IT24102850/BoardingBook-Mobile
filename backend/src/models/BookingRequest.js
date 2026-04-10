const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    bookingType: {
      type: String,
      enum: ['individual', 'group'],
      default: 'individual',
    },
    groupName: {
      type: String,
      default: '',
      trim: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingGroup',
      default: null,
      index: true,
    },
    groupSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    moveInDate: {
      type: Date,
      required: true,
    },
    durationMonths: {
      type: Number,
      default: 6,
      min: 1,
      max: 36,
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    agreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingAgreement',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingRequestSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
bookingRequestSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
