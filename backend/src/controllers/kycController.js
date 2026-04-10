const User = require('../models/User');

/**
 * POST /api/kyc/submit
 * Owner submits NIC front, NIC back, and selfie for KYC verification.
 */
exports.submitKyc = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Only owners can submit KYC' });
    }

    if (user.kycStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'KYC already approved' });
    }

    if (user.kycStatus === 'pending') {
      return res.status(400).json({ success: false, message: 'KYC already submitted and under review' });
    }

    const files = req.files;
    if (!files?.nicFront || !files?.nicBack || !files?.selfie) {
      return res.status(400).json({ success: false, message: 'NIC front, NIC back, and selfie are all required' });
    }

    await User.findByIdAndUpdate(user._id, {
      kycStatus: 'pending',
      kycSubmittedAt: new Date(),
      kycDocuments: {
        nicFront: files.nicFront[0].filename,
        nicBack:  files.nicBack[0].filename,
        selfie:   files.selfie[0].filename,
      },
    });

    res.status(200).json({
      success: true,
      message: 'KYC documents submitted successfully. Under review.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'KYC submission failed', error: err.message });
  }
};

/**
 * GET /api/kyc/status
 * Owner checks their own KYC status.
 */
exports.getKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        kycSubmittedAt: user.kycSubmittedAt,
        kycRejectionReason: user.kycRejectionReason,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
