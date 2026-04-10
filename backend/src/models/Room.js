const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardingHouse',
  },
  name: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    default: '',
  },
  floor: {
    type: Number,
    default: 1,
    min: 1,
  },
  bedCount: {
    type: Number,
    default: 1,
    min: 1,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 5000,
    max: 50000,
  },
  totalSpots: {
    type: Number,
    required: true,
    min: 1,
  },
  occupancy: {
    type: Number,
    default: 0,
    min: 0,
  },
  facilities: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  roomType: {
    type: String,
    default: 'Single Room',
  },
  genderPreference: {
    type: String,
    default: 'Any',
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
    default: 'None',
  },
  owner: {
    type: String,
    default: '',
  },
  ownerPhone: {
    type: String,
    default: '',
  },
  ownerEmail: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  rules: {
    type: [String],
    default: [],
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  campus: {
    type: String,
    default: '',
    enum: ['SLIIT Malabe', 'UOM', 'UOC', 'NSBM', 'USJP', ''],
  },
  distKm: {
    type: Number,
    default: 0,
    min: 0,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },

  isActive: {
    type: Boolean,
    default: true,
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


// Create geospatial index for coordinates
roomSchema.index({ coordinates: '2dsphere' });
roomSchema.index({ campus: 1 });
roomSchema.index({ rating: -1 });
roomSchema.index({ price: 1 });

// Additional indexes for performance
roomSchema.index({ ownerId: 1, isActive: 1 });
roomSchema.index({ status: 1 });

// Virtual for vacancy
roomSchema.virtual('vacancy').get(function () {
  return this.totalSpots - this.occupancy;
});

// Update timestamp on save
roomSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Room', roomSchema);
