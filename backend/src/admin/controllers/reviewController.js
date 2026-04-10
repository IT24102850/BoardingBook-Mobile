const Review = require('../models/Review');

/**
 * GET /api/admin/reviews
 * Query params: isFlagged, isVisible, page, limit
 */
exports.getAllReviews = async (req, res) => {
  try {
    const { isFlagged, isVisible, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (isFlagged !== undefined) filter.isFlagged = isFlagged === 'true';
    if (isVisible !== undefined) filter.isVisible = isVisible === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate({ path: 'userId', select: 'email firstName lastName fullName role', options: { strictPopulate: false } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: err.message });
  }
};

/**
 * PATCH /api/admin/reviews/:id/flag
 * Body: { reason }
 */
exports.flagReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true, flagReason: reason || '', isVisible: false },
      { new: true }
    ).populate('userId', 'email firstName lastName fullName role');

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review flagged', data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to flag review', error: err.message });
  }
};

/**
 * PATCH /api/admin/reviews/:id/unflag
 */
exports.unflagReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isFlagged: false, flagReason: '', isVisible: true },
      { new: true }
    ).populate('userId', 'email firstName lastName fullName role');

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review unflagged', data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unflag review', error: err.message });
  }
};

/**
 * DELETE /api/admin/reviews/:id
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete review', error: err.message });
  }
};

/**
 * GET /api/admin/reviews/stats
 */
exports.getReviewStats = async (req, res) => {
  try {
    const [total, flagged, hidden] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ isFlagged: true }),
      Review.countDocuments({ isVisible: false }),
    ]);

    res.status(200).json({ success: true, data: { total, flagged, hidden } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch review stats', error: err.message });
  }
};
