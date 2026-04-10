const mongoose = require('mongoose');

const bookingGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: String,
      name: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  boardingHouse: {
    type: String,
    default: '',
  },
  scenario: {
    type: String,
    enum: ['join-existing', 'new-place'],
    default: 'new-place',
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null,
  },
  currentBoardingHouseTag: {
    type: String,
    default: '',
  },
  plannedBoardingHouseTag: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['forming', 'ready', 'booked'],
    default: 'forming',
  },
  totalBudget: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
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

// Update timestamp on save
bookingGroupSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

bookingGroupSchema.index({ creatorId: 1, updatedAt: -1 });
bookingGroupSchema.index({ 'members.userId': 1, updatedAt: -1 });

module.exports = mongoose.model('BookingGroup', bookingGroupSchema);
