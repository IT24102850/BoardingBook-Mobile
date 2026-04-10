const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: 'https://randomuser.me/api/portraits/lego/1.jpg',
  },
  budget: {
    type: Number,
    required: true,
    min: 5000,
    max: 50000,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  academicYear: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    required: true,
  },
  preferences: {
    type: String,
    default: '',
  },
  roomType: {
    type: String,
    enum: ['Single Room', 'Shared Room'],
    required: true,
  },
  billsIncluded: {
    type: Boolean,
    default: false,
  },
  availableFrom: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  boardingHouse: {
    type: String,
    default: '',
  },
  boardingScenario: {
    type: String,
    enum: ['join-existing', 'new-place', 'none'],
    default: 'none',
  },
  taggedRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null,
  },
  taggedRoomVacancy: {
    type: Number,
    default: null,
    min: 0,
  },
  lookingFor: {
    type: String,
    default: 'Shared Room',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
roommateProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);
