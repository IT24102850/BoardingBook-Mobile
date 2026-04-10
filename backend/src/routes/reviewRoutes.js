const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const Review = require('../admin/models/Review');

// POST /api/reviews — student submits a review
router.post('/', userAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const review = await Review.create({ userId: req.user._id, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews — get all visible, unflagged reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isVisible: true, isFlagged: false })
      .populate('userId', 'fullName firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
