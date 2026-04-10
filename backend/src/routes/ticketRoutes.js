const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const SupportTicket = require('../admin/models/SupportTicket');

// POST /api/tickets — submit a new ticket
router.post('/', userAuth, async (req, res) => {
  try {
    const { subject, description, category } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }
    const ticket = await SupportTicket.create({
      userId: req.user._id,
      subject,
      description,
      category: category || 'other',
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tickets/my — get current user's own tickets
router.get('/my', userAuth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
