const SupportTicket = require('../models/SupportTicket');

/**
 * GET /api/admin/tickets
 * Query params: status, page, limit
 */
exports.getAllTickets = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .populate({ path: 'userId', select: 'email firstName lastName fullName role', options: { strictPopulate: false } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SupportTicket.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { tickets, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: err.message });
  }
};

/**
 * GET /api/admin/tickets/:id
 */
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'email firstName lastName fullName role');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ticket', error: err.message });
  }
};

/**
 * PATCH /api/admin/tickets/:id/status
 * Body: { status }
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const update = { status };
    if (status === 'resolved' || status === 'closed') update.resolvedAt = new Date();

    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('userId', 'email firstName lastName fullName role');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.status(200).json({ success: true, message: 'Status updated', data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
};

/**
 * POST /api/admin/tickets/:id/reply
 * Body: { content }
 */
exports.replyToTicket = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      {
        $push: { messages: { sender: 'admin', content: content.trim() } },
        $set: { status: 'in_progress' },
      },
      { new: true }
    ).populate('userId', 'email firstName lastName fullName role');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.status(200).json({ success: true, message: 'Reply sent', data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send reply', error: err.message });
  }
};

/**
 * GET /api/admin/tickets/stats
 */
exports.getTicketStats = async (req, res) => {
  try {
    const [open, in_progress, resolved, closed] = await Promise.all([
      SupportTicket.countDocuments({ status: 'open' }),
      SupportTicket.countDocuments({ status: 'in_progress' }),
      SupportTicket.countDocuments({ status: 'resolved' }),
      SupportTicket.countDocuments({ status: 'closed' }),
    ]);

    res.status(200).json({ success: true, data: { open, in_progress, resolved, closed } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ticket stats', error: err.message });
  }
};
