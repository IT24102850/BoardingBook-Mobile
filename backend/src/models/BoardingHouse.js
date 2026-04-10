const mongoose = require('mongoose');

const boardingHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    monthlyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    roomType: {
      type: String,
      default: 'Single Room',
    },
    availableFrom: {
      type: String,
      default: '',
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    roommateCount: {
      type: String,
      default: 'None (Private)',
    },
    description: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    occupiedRooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    genderPreference: {
      type: String,
      enum: ['any', 'girls', 'boys'],
      default: 'any',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique compound index to prevent duplicates
// Allows multiple owners to have boarding houses with the same name,
// but prevents the same owner from having duplicate named houses
boardingHouseSchema.index({ name: 1, ownerId: 1 }, { unique: true });

// Additional indexes for performance
boardingHouseSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('BoardingHouse', boardingHouseSchema);
