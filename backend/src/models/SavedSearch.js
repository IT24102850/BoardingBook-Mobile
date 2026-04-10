const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  filters: {
    search: String,
    maxPrice: Number,
    minPrice: Number,
    roomType: String,
    campus: String,
    facilities: [String],
    minRating: Number,
    minVacancy: Number,
    sort: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUsed when search is accessed
savedSearchSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
