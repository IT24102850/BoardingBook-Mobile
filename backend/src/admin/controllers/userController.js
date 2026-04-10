const User = require('../../models/User');

/**
 * GET /api/admin/users
 * Query params: role, search, page, limit
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role && ['student', 'owner'].includes(role)) filter.role = role;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -verificationToken -verificationTokenExpiry -loginHistory -passwordResetToken -passwordResetTokenExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
};

/**
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -verificationTokenExpiry -loginHistory -passwordResetToken -passwordResetTokenExpiry');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: err.message });
  }
};

/**
 * PATCH /api/admin/users/:id/ban
 */
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true, select: '-password -verificationToken -verificationTokenExpiry' }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User banned', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to ban user', error: err.message });
  }
};

/**
 * PATCH /api/admin/users/:id/unban
 */
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true, select: '-password -verificationToken -verificationTokenExpiry' }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User unbanned', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unban user', error: err.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
};

/**
 * GET /api/admin/kyc
 * Query params: status (pending | approved | rejected)
 */
exports.getKycSubmissions = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const allowed = ['pending', 'approved', 'rejected', 'not_submitted'];
    const safeStatus = allowed.includes(status) ? status : 'pending';

    const sortField = safeStatus === 'not_submitted' ? 'createdAt' : 'kycSubmittedAt';
    const users = await User.find({ role: 'owner', kycStatus: safeStatus })
      .select('-password -verificationToken -verificationTokenExpiry -loginHistory -passwordResetToken -passwordResetTokenExpiry')
      .sort({ [sortField]: -1 });

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch KYC submissions', error: err.message });
  }
};

/**
 * PATCH /api/admin/kyc/:id/approve
 */
exports.approveKyc = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'owner' },
      { kycStatus: 'approved' },
      { new: true, select: '-password -verificationToken -verificationTokenExpiry' }
    );

    if (!user) return res.status(404).json({ success: false, message: 'Owner not found' });

    res.status(200).json({ success: true, message: 'KYC approved', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve KYC', error: err.message });
  }
};

/**
 * PATCH /api/admin/kyc/:id/reject
 */
exports.rejectKyc = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'owner' },
      { kycStatus: 'rejected', kycRejectionReason: reason || '' },
      { new: true, select: '-password -verificationToken -verificationTokenExpiry' }
    );

    if (!user) return res.status(404).json({ success: false, message: 'Owner not found' });

    res.status(200).json({ success: true, message: 'KYC rejected', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reject KYC', error: err.message });
  }
};

/**
 * GET /api/admin/users/:id/activity
 */
exports.getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('email lastLogin loginHistory');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({
      success: true,
      data: {
        lastLogin: user.lastLogin,
        loginHistory: (user.loginHistory || []).slice().reverse(), // newest first
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity', error: err.message });
  }
};

/**
 * GET /api/admin/stats
 */
exports.getStats = async (_req, res) => {
  try {
    const [totalStudents, totalOwners, pendingKyc, bannedUsers] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'owner', kycStatus: 'pending' }),
      User.countDocuments({ isBanned: true }),
    ]);

    res.status(200).json({
      success: true,
      data: { totalStudents, totalOwners, pendingKyc, bannedUsers },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
};

/**
 * GET /api/admin/signup-chart?days=30
 * Returns daily signup counts split by role for the last N days.
 */
exports.getSignupChart = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const raw = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Build a full date range filling zeros for days with no signups
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        students: raw.find(r => r._id.date === dateStr && r._id.role === 'student')?.count ?? 0,
        owners:   raw.find(r => r._id.date === dateStr && r._id.role === 'owner')?.count ?? 0,
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch signup chart', error: err.message });
  }
};
